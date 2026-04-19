import type { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  
  const match = url.pathname.match(/^\/(en|ar|ckb)\/articles\/([^\/]+)\/?$/);
  
  if (!match) {
    return context.next();
  }

  const locale = match[1];
  const slug = match[2];

  const response = await context.next();
  let html = await response.text();

  const supabaseUrl = Netlify.env.get("VITE_SUPABASE_DATABASE_URL") || Netlify.env.get("VITE_SUPABASE_URL");
  const supabaseKey = Netlify.env.get("VITE_SUPABASE_ANON_KEY");

  if (supabaseUrl && supabaseKey) {
    try {
      // 1. Added 'content' and 'video_url' to the select query just in case you use either
      const apiUrl = `${supabaseUrl}/rest/v1/articles?slug=eq.${slug}&locale=eq.${locale}&select=title,excerpt,image_url,content,video_url`;
      
      const supaRes = await fetch(apiUrl, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      const data = await supaRes.json();
      const article = data[0];

      if (article) {
        const title = article.title;
        const description = article.excerpt || title;
        
        // 2. Logic to determine the best image
        let image = article.image_url;

        // If no explicit image_url exists, check for a YouTube video
        if (!image) {
          // Combine video_url and content into one string to search for a YouTube link
          const textToSearch = `${article.video_url || ''} ${article.content || ''}`;
          
          // Regex to extract the 11-character YouTube Video ID
          const ytMatch = textToSearch.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
          
          if (ytMatch && ytMatch[1]) {
            const ytId = ytMatch[1];
            // Use YouTube's automatically generated high-res thumbnail
            image = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
          }
        }

        // 3. Fallback to default branding if no image or video is found
        if (!image) {
          image = 'https://miransafiny.com/miran.png';
        }

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