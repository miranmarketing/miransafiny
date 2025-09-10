// Vercel serverless function for prerendering
const { createClient } = require('@supabase/supabase-js');

const CRAWLER_USER_AGENTS = [
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandexbot',
  'facebookexternalhit', 'twitterbot', 'rogerbot', 'linkedinbot', 'embedly',
  'quora link preview', 'showyoubot', 'outbrain', 'pinterest',
  'developers.google.com/+/web/snippet', 'slackbot', 'vkshare', 'w3c_validator',
  'redditbot', 'applebot', 'whatsapp', 'flipboard', 'tumblr', 'bitlybot',
  'skypeuripreview', 'nuzzel', 'discordbot', 'google page speed', 'qwantify',
  'pinterestbot', 'bitrix link preview', 'xing-contenttabreceiver',
  'chrome-lighthouse', 'telegrambot'
];

function isCrawler(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some(crawler => ua.includes(crawler));
}

function generateArticleHTML(article) {
  const title = `${article.title} | Miran Safiny`;
  const description = article.excerpt || 'Article by Miran Safiny';
  const image = article.image_url || 'https://miransafiny.com/miransafiny.png';
  const url = `https://miransafiny.com/articles/${article.slug}`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="author" content="${article.author}">
    <link rel="canonical" href="${url}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image}">
    <meta property="og:url" content="${url}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Miran Safiny">
    <meta property="article:published_time" content="${article.published_at}">
    <meta property="article:modified_time" content="${article.updated_at}">
    <meta property="article:author" content="${article.author}">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${image}">
    <meta name="twitter:creator" content="@miran_marketing">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${article.title}",
      "description": "${description}",
      "image": "${image}",
      "author": {
        "@type": "Person",
        "name": "${article.author}",
        "url": "https://miransafiny.com"
      },
      "publisher": {
        "@type": "Person",
        "name": "Miran Safiny",
        "url": "https://miransafiny.com"
      },
      "url": "${url}",
      "datePublished": "${article.published_at}",
      "dateModified": "${article.updated_at}",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${url}"
      }
    }
    </script>
</head>
<body>
    <article>
        <h1>${article.title}</h1>
        <p><strong>By ${article.author}</strong> | ${new Date(article.published_at).toLocaleDateString()}</p>
        ${article.image_url ? `<img src="${article.image_url}" alt="${article.title}" style="max-width: 100%; height: auto;">` : ''}
        <div>${article.content || article.excerpt}</div>
    </article>
    
    <!-- Prerender indicator -->
    <meta name="prerender-status-code" content="200">
    
    <!-- Load the actual React app for non-crawlers -->
    <script>
        if (!/bot|crawler|spider|crawling/i.test(navigator.userAgent)) {
            window.location.replace('${url}');
        }
    </script>
</body>
</html>`;
}

module.exports = async (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const { pathname } = new URL(req.url, `https://${req.headers.host}`);
  
  // Check if this is a crawler
  const isBot = isCrawler(userAgent);
  const hasPrerender = req.url.includes('_escaped_fragment_') || req.url.includes('prerender=true');
  
  if (!isBot && !hasPrerender) {
    return res.status(404).json({ error: 'Not found' });
  }

  console.log(`Prerendering request: ${userAgent} - ${pathname}`);

  // Handle article pages
  const articleMatch = pathname.match(/^\/articles\/(.+)$/);
  if (articleMatch) {
    const slug = articleMatch[1];
    
    try {
      const supabase = createClient(
        process.env.VITE_SUPABASE_DATABASE_URL,
        process.env.VITE_SUPABASE_ANON_KEY
      );
      
      const { data: article, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !article) {
        return res.status(404).json({ error: 'Article not found' });
      }

      const html = generateArticleHTML(article);
      
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('X-Prerender', 'true');
      
      return res.status(200).send(html);
      
    } catch (error) {
      console.error('Error fetching article:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // For other pages, return basic HTML
  const basicHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Miran Safiny | Vision-Driven Entrepreneur</title>
    <meta name="description" content="Miran Safiny is a visionary entrepreneur and business leader based in Erbil, Kurdistan.">
    <link rel="canonical" href="https://miransafiny.com${pathname}">
</head>
<body>
    <h1>Miran Safiny</h1>
    <p>Vision-Driven Entrepreneur | Marketing Strategist | Real Estate Leader</p>
    <meta name="prerender-status-code" content="200">
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Prerender', 'true');
  res.status(200).send(basicHTML);
};