/*
  Multilingual articles: locale + translation groups, video URLs.
  - Each logical article is a group (translation_group_id); one row per locale (en, ar, ckb).
  - Slug is unique per locale (same slug string can exist in different locales).
*/

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS translation_group_id uuid,
  ADD COLUMN IF NOT EXISTS video_urls text[] DEFAULT '{}'::text[];

ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_slug_key;

UPDATE articles
SET translation_group_id = COALESCE(translation_group_id, id)
WHERE translation_group_id IS NULL;

ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_locale_check;
ALTER TABLE articles
  ADD CONSTRAINT articles_locale_check CHECK (locale IN ('en', 'ar', 'ckb'));

CREATE UNIQUE INDEX IF NOT EXISTS articles_slug_locale_unique ON articles (slug, locale);
CREATE INDEX IF NOT EXISTS idx_articles_translation_group ON articles (translation_group_id);
CREATE INDEX IF NOT EXISTS idx_articles_locale ON articles (locale);
