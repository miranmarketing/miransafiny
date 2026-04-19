import type { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  
  // 1. Extract locale and slug from the URL
  // Example: /ckb/articles/karigari-abori-romali...
  const match = url.pathname.match(/^\/(en|ar|ckb)\/articles\/([^\/]+)\/?$/);
  
  // If it's not a valid article URL, just serve the normal index.html
  if (!match) {
    return context.next();
  }

  const locale = match[1];
  const slug = match[2];

  // 2. Fetch the raw index.html response
  const response = await context.next();
  let html = await response.text();

  // 3. Fetch the article data from Supabase
  // Note: Netlify Edge Functions use Deno, so we use standard fetch and Netlify.env
  const supabaseUrl = Netlify.env.get("VITE_SUPABASE_DATABASE_URL") || Netlify.env.get("VITE_SUPABASE_URL");
  const supabaseKey = Netlify.env.get("VITE_SUPABASE_ANON_KEY");

  if (supabaseUrl && supabaseKey) {
    try {
      // Use the Supabase REST API directly for speed on the Edge
      const apiUrl = `${supabaseUrl}/rest/v1/articles?slug=eq.${slug}&locale=eq.${locale}&select=title,excerpt,image_url`;
      
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
        // Fallback to default image if article has no image
        const image = article.image_url || 'https://miransafiny.com/miran.png';

        // 4. Inject the dynamic tags into the HTML string
        // Replace Title
        html = html.replace(
          /<title>.*?<\/title>/i, 
          `<title>${title} | Miran Safiny</title>`
        );
        
        // Replace Description
        html = html.replace(
          /<meta\s+name="description"\s+content="[^"]*"/i, 
          `<meta name="description" content="${description.replace(/"/g, '&quot;')}"`
        );
        
        // Replace OG Image
        html = html.replace(
          /<meta\s+property="og:image"\s+content="[^"]*"/i, 
          `<meta property="og:image" content="${image}"`
        );

        // Add OG Title and Description (if missing) right before </head>
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

  // 5. Return the modified HTML to the crawler/browser
  return new Response(html, {
    headers: { "content-type": "text/html;charset=UTF-8" },
  });
};