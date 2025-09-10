import type { Context } from "https://edge.netlify.com";

const CRAWLER_USER_AGENTS = [
  'googlebot',
  'bingbot', 
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebookexternalhit',
  'twitterbot',
  'rogerbot',
  'linkedinbot',
  'embedly',
  'quora link preview',
  'showyoubot',
  'outbrain',
  'pinterest',
  'developers.google.com/+/web/snippet',
  'slackbot',
  'vkshare',
  'w3c_validator',
  'redditbot',
  'applebot',
  'whatsapp',
  'flipboard',
  'tumblr',
  'bitlybot',
  'skypeuripreview',
  'nuzzel',
  'discordbot',
  'google page speed',
  'qwantify',
  'pinterestbot',
  'bitrix link preview',
  'xing-contenttabreceiver',
  'chrome-lighthouse',
  'telegrambot'
];

function isCrawler(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some(crawler => ua.includes(crawler));
}

export default async (request: Request, context: Context) => {
  const userAgent = request.headers.get('user-agent') || '';
  const url = new URL(request.url);
  
  // Check if this is a crawler or has prerender parameter
  const isBot = isCrawler(userAgent);
  const hasPrerender = url.searchParams.has('_escaped_fragment_') || url.searchParams.has('prerender');
  
  if (!isBot && !hasPrerender) {
    // Not a crawler, serve normally
    return;
  }

  console.log(`Prerendering for: ${userAgent} - ${url.pathname}`);

  try {
    // For article pages, we could potentially fetch the content and inject it
    // For now, we'll add the prerender headers and let the SPA handle it
    const response = await context.next();
    
    // Add prerender headers
    const newHeaders = new Headers(response.headers);
    newHeaders.set('X-Prerender', 'true');
    newHeaders.set('X-Prerender-User-Agent', userAgent);
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
    
  } catch (error) {
    console.error('Prerender error:', error);
    return;
  }
};