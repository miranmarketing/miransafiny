import React, { useEffect } from 'react';
import { shouldPrerender, addPrerenderMeta } from '../utils/crawlerDetection';

const PrerenderDetector: React.FC = () => {
  useEffect(() => {
    // Add prerender meta tags if this is a crawler
    addPrerenderMeta();

    // Log for debugging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('Prerender detection:', {
        shouldPrerender: shouldPrerender(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    }
  }, []);

  return null; // This component doesn't render anything
};

export default PrerenderDetector;