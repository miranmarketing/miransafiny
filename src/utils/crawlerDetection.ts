/**
 * Detects if the current request is from a search engine crawler
 */
export const isCrawler = (userAgent?: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  const ua = userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '');
  
  const crawlerPatterns = [
    /googlebot/i,
    /bingbot/i,
    /slurp/i, // Yahoo
    /duckduckbot/i,
    /baiduspider/i,
    /yandexbot/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /rogerbot/i, // Moz
    /linkedinbot/i,
    /embedly/i,
    /quora link preview/i,
    /showyoubot/i,
    /outbrain/i,
    /pinterest\/0\./i,
    /developers\.google\.com\/\+\/web\/snippet/i,
    /slackbot/i,
    /vkshare/i,
    /w3c_validator/i,
    /redditbot/i,
    /applebot/i,
    /whatsapp/i,
    /flipboard/i,
    /tumblr/i,
    /bitlybot/i,
    /skypeuripreview/i,
    /nuzzel/i,
    /discordbot/i,
    /google page speed/i,
    /qwantify/i,
    /pinterestbot/i,
    /bitrix link preview/i,
    /xing-contenttabreceiver/i,
    /chrome-lighthouse/i,
    /telegrambot/i
  ];

  return crawlerPatterns.some(pattern => pattern.test(ua));
};

/**
 * Checks if prerendering should be enabled
 */
export const shouldPrerender = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for prerender query parameter (for testing)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('_escaped_fragment_') !== null || urlParams.get('prerender') === 'true') {
    return true;
  }

  // Check user agent
  return isCrawler();
};

/**
 * Adds prerender meta tag if needed
 */
export const addPrerenderMeta = (): void => {
  if (typeof document === 'undefined') return;
  
  if (shouldPrerender()) {
    const meta = document.createElement('meta');
    meta.name = 'prerender-status-code';
    meta.content = '200';
    document.head.appendChild(meta);
  }
};