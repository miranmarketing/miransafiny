-- Featured image alt text (SEO), optional hero video instead of featured image
ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS featured_image_alt text,
  ADD COLUMN IF NOT EXISTS hero_video_url text;

COMMENT ON COLUMN articles.featured_image_alt IS 'Descriptive alt text for the featured image (SEO, accessibility)';
COMMENT ON COLUMN articles.hero_video_url IS 'If set, embedded as hero instead of featured image (YouTube/Vimeo URL)';
