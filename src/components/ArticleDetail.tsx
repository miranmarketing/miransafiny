import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase, Article } from '../lib/supabase'; // Correct path to your supabase.ts
import { Share2, Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  useEffect(() => {
    // Scrolls to the top of the page when the component mounts or slug changes
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function fetchArticle() {
      if (!slug) return;

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching article:', error);
        setArticle(null);
      } else {
        setArticle(data);
      }
    }
    fetchArticle();
  }, [slug]);

  // --- UPDATED: useEffect for Meta Tag Updates using 'excerpt' ---
  useEffect(() => {
    const head = document.head;
    const currentUrl = window.location.href; // Get the current canonical URL

    // Function to create or update a meta tag
    const updateMetaTag = (property: string, content: string, attribute: 'property' | 'name' = 'property') => {
      let tag = head.querySelector(`meta[${attribute}="${property}"]`) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, property);
        head.appendChild(tag);
      }
      tag.content = content;
    };

    // Function to remove a meta tag
    const removeMetaTag = (property: string, attribute: 'property' | 'name' = 'property') => {
      const tag = head.querySelector(`meta[${attribute}="${property}"]`);
      if (tag) {
        head.removeChild(tag);
      }
    };

    // Set a base title
    document.title = article ? article.title : 'Loading Article... - Your Website Name'; // Default title while loading

    if (article) {
      // Set page title
      document.title = article.title;

      // Open Graph (OG) Meta Tags for Facebook, LinkedIn, WhatsApp etc.
      updateMetaTag('og:title', article.title);
      updateMetaTag('og:description', article.excerpt); // Using 'excerpt'
      updateMetaTag('og:image', article.image_url || `${window.location.origin}/default-share-image.jpg`); // Fallback default image
      updateMetaTag('og:url', currentUrl);
      updateMetaTag('og:type', 'article');
      updateMetaTag('og:site_name', 'Your Website Name'); // Important for consistency

      // Twitter Card Meta Tags
      updateMetaTag('twitter:card', 'summary_large_image', 'name');
      updateMetaTag('twitter:site', '@YourWebsiteHandle', 'name'); // Replace with your Twitter handle
      updateMetaTag('twitter:creator', '@YourWebsiteHandle', 'name'); // Using site handle as author handle is not in schema
      updateMetaTag('twitter:title', article.title, 'name');
      updateMetaTag('twitter:description', article.excerpt, 'name'); // Using 'excerpt'
      updateMetaTag('twitter:image', article.image_url || `${window.location.origin}/default-share-image.jpg`, 'name');
    } else {
      // Clean up/reset meta tags when article is not loaded or on unmount
      document.title = 'Your Website Default Title'; // Reset to a generic title

      // Remove specific article meta tags
      removeMetaTag('og:title');
      removeMetaTag('og:description');
      removeMetaTag('og:image');
      removeMetaTag('og:url');
      removeMetaTag('og:type');
      removeMetaTag('og:site_name');

      removeMetaTag('twitter:card', 'name');
      removeMetaTag('twitter:site', 'name');
      removeMetaTag('twitter:creator', 'name');
      removeMetaTag('twitter:title', 'name');
      removeMetaTag('twitter:description', 'name');
      removeMetaTag('twitter:image', 'name');
    }

    // Clean up meta tags when component unmounts or slug changes
    return () => {
      // Revert to generic tags or remove them entirely
      removeMetaTag('og:title');
      removeMetaTag('og:description');
      removeMetaTag('og:image');
      removeMetaTag('og:url');
      removeMetaTag('og:type');
      removeMetaTag('og:site_name');

      removeMetaTag('twitter:card', 'name');
      removeMetaTag('twitter:site', 'name');
      removeMetaTag('twitter:creator', 'name');
      removeMetaTag('twitter:title', 'name');
      removeMetaTag('twitter:description', 'name');
      removeMetaTag('twitter:image', 'name');
      document.title = 'Your Website Default Title'; // Reset title for other pages
    };
  }, [article, slug]); // Depend on article and slug for updates

  const currentUrl = window.location.href;
  const shareText = article ? `Check out this article: ${article.title}: ${currentUrl}` : `Check out this article: ${currentUrl}`;

  const handleShareClick = () => {
    setShowShareOptions(!showShareOptions);
  };

  const copyToClipboard = () => {
    const el = document.createElement('textarea');
    el.value = currentUrl;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    setShowCopyMessage(true);
    setTimeout(() => {
      setShowCopyMessage(false);
    }, 2000);
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-[#100C0D] text-[#E3DCD2] flex items-center justify-center pt-[80px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CC8B65] mx-auto"></div>
        <p className="ml-4 text-lg">Loading article...</p>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[#100C0D] text-[#E3DCD2] min-h-screen mt-[80px]">
      <h1 className="text-3xl font-bold mb-4 text-[#E3DCD2]">{article.title}</h1>
      <p className="mb-4 text-[#E3DCD2]/70">
        By {article.author} on {new Date(article.published_at).toLocaleDateString()}
      </p>
      {article.image_url ? (
        <img
          src={article.image_url}
          alt={article.title}
          className="mb-6 rounded-lg w-full h-auto object-cover shadow-lg"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://placehold.co/800x450/CC8B65/100C0D?text=Article+Image`;
          }}
        />
      ) : (
        <div className="mb-6 rounded-lg w-full h-auto object-cover shadow-lg bg-gradient-to-br from-[#CC8B65] to-[#013328] flex items-center justify-center" style={{ height: '450px' }}>
          <span className="text-[#100C0D] text-xl font-medium">No Image Available</span>
        </div>
      )}
      <div className="prose prose-invert max-w-none !text-[#E3DCD2]" dangerouslySetInnerHTML={{ __html: article.content || '' }} />

      {/* Share Section */}
      <div className="mt-8 pt-6 border-t border-[#E3DCD2]/20 relative">
        <button
          onClick={handleShareClick}
          className="flex items-center px-4 py-2 rounded-full bg-[#CC8B65] text-[#100C0D] font-semibold hover:bg-[#A96A47] transition-colors duration-200 shadow-md"
        >
          <Share2 className="w-5 h-5 mr-2" /> Share Article
        </button>

        {showShareOptions && (
          <div className="mt-4 flex flex-wrap gap-3 items-center">
            {/* WhatsApp Share Button */}
            <a
              href={`whatsapp://send?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] text-white hover:bg-[#1DA851] transition-colors duration-200 shadow-md"
              aria-label="Share on WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12.04 2C7.04 2 3 6.04 3 11.04c0 1.79.52 3.51 1.45 5.01l-1.16 4.24 4.33-1.14c1.47.8 3.14 1.23 4.42 1.23h.02c5 0 9.04-4.04 9.04-9.04S17.04 2 12.04 2zm0 16.5c-1.39 0-2.82-.4-4.01-1.17l-.29-.17-3 1.05 1.07-2.92-.19-.3c-.83-1.35-1.27-2.9-1.27-4.5h.01c0-4.01 3.26-7.27 7.27-7.27s7.27 3.26 7.27 7.27c0 4.01-3.26 7.27-7.27 7.27zm3.15-4.93c-.17-.08-.99-.49-1.14-.55-.15-.07-.26-.08-.37.08-.11.16-.43.55-.53.66-.1.1-.21.12-.39.05s-.79-.29-.94-.58c-.15-.29-.02-.27.1-.4.1-.11.23-.29.34-.43.1-.15.15-.26.23-.4-.08-.15-.71-1.7-.77-1.84-.06-.14-.12-.12-.26-.12h-.3c-.14 0-.37.05-.57.26-.2.21-.76.74-.76 1.8s.78 2.09.89 2.24c.11.15 1.52 2.32 3.67 3.24.52.22.93.35 1.25.45.5.16.6.11.75-.02.15-.14.43-.59.49-.69.06-.11.06-.2.04-.37-.02-.17-.08-.29-.17-.42z"/>
              </svg>
            </a>

            {/* Facebook Share Button */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1877F2] text-white hover:bg-[#145CB3] transition-colors duration-200 shadow-md"
              aria-label="Share on Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>

            {/* Twitter/X Share Button */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1DA1F2] text-white hover:bg-[#1A8CD8] transition-colors duration-200 shadow-md"
              aria-label="Share on Twitter/X"
            >
              <Twitter className="w-6 h-6" />
            </a>

            {/* LinkedIn Share Button */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0A66C2] text-white hover:bg-[#074B8F] transition-colors duration-200 shadow-md"
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>

            {/* Copy Link Button */}
            <div className="relative">
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-[#E3DCD2] text-[#100C0D] hover:bg-[#C9C2B8] transition-colors duration-200 shadow-md"
                aria-label="Copy link to clipboard"
              >
                <LinkIcon className="w-6 h-6" />
              </button>
              <div
                className={`absolute left-1/2 -translate-x-1/2 -top-10 bg-green-600 text-white text-xs px-2 py-1 rounded-md shadow-lg whitespace-nowrap transition-opacity duration-300 ${showCopyMessage ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                Link copied!
              </div>
            </div>

            <div className="w-full text-sm text-[#E3DCD2]/70 mt-2">
              <p>For Instagram, TikTok, and WhatsApp stories, direct web sharing is not consistently supported. Please copy the link and share it directly within the app, where you may find an option to add it to your story/status.</p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default ArticleDetail;