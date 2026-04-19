import type { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  
  // 1. Extract optional locale and slug from the URL
  // Matches: /articles/slug, /en/articles/slug, /ar/articles/slug, /ckb/articles/slug
  const match = url.pathname.match(/^\/(?:(en|ar|ckb)\/)?articles\/([^\/]+)\/?$/);
  
  if (!match) {
    return context.next();
  }

  // Default to English if no locale is in the URL
  const locale = match[1] || 'en';
  const slug = match[2];

  const response = await context.next();
  let html = await response.text();

  const supabaseUrl = Netlify.env.get("VITE_SUPABASE_DATABASE_URL") || Netlify.env.get("VITE_SUPABASE_URL");
  const supabaseKey = Netlify.env.get("VITE_SUPABASE_ANON_KEY");

  if (supabaseUrl && supabaseKey) {
    try {
      // 2. Query the CORRECT columns based on your src/lib/supabase.ts interface
      const apiUrl = `${supabaseUrl}/rest/v1/articles?slug=eq.${slug}&locale=eq.${locale}&select=title,excerpt,image_url,content,hero_video_url,video_urls`;
      
      const supaRes = await fetch(apiUrl, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      const data = await supaRes.json();
      
      // If the query fails (e.g., column mismatch), Supabase returns an error object, not an array
      if (!Array.isArray(data)) {
        console.error("Supabase API Error:", data);
        return new Response(html, { headers: { "content-type": "text/html;charset=UTF-8" } });
      }

      const article = data[0];

      if (article) {
        const title = article.title;
        const description = article.excerpt || title;
        let image = article.image_url;

        // 3. YouTube Thumbnail Fallback Logic
        if (!image) {
          let ytMatch = null;
          const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
          
          // Check A: hero_video_url
          if (article.hero_video_url) {
            ytMatch = article.hero_video_url.match(ytRegex);
          }
          // Check B: video_urls array (if it exists and has items)
          if (!ytMatch && Array.isArray(article.video_urls) && article.video_urls.length > 0) {
            ytMatch = article.video_urls[0].match(ytRegex);
          }
          // Check C: Inside the article content
          if (!ytMatch && article.content) {
            ytMatch = article.content.match(ytRegex);
          }

          // If we found a YouTube ID in any of those places, generate the thumbnail URL
          if (ytMatch && ytMatch[1]) {
            image = `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
          }
        }

        // 4. Final Fallback to standard branding
        image = image || 'https://miransafiny.com/miran.png';

        // 5. Inject tags into the HTML string
        html = html.replace(
          /<title>.*?<\/title>/i, 
          `<title>${title} | Miran Safiny</title>`
        );
        
        html = html.replace(
          /<meta\s+name="description"\s+content="[^"]*"/i, 
          `<meta name="description" content="${description.replace(/"/g, '&quot;')}"`
        );
        
        html = html.replace(
          /<meta\s+property="og:image"\s+content="[^"]*"/i, 
          `<meta property="og:image" content="${image}"`
        );

        const ogTags = `
          <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
          <meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />
          <meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />
          <meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />
          <meta name="twitter:image" content="${image}" />
        `;
        html = html.replace('</head>', `${ogTags}</head>`);
      }
    } catch (err) {
      console.error("Edge SEO injection failed:", err);
    }
  }

  return new Response(html, {
    headers: { "content-type": "text/html;charset=UTF-8" },
  });
};