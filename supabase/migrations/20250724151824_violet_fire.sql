/*
  # Create articles table for Miran Safiny website

  1. New Tables
    - `articles`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `excerpt` (text, short description)
      - `content` (text, full article content)
      - `slug` (text, URL-friendly identifier)
      - `author` (text, article author)
      - `image_url` (text, featured image URL)
      - `tags` (text array, article tags)
      - `published_at` (timestamptz, publication date)
      - `created_at` (timestamptz, creation timestamp)
      - `updated_at` (timestamptz, last update timestamp)

  2. Security
    - Enable RLS on `articles` table
    - Add policy for public read access to published articles
    - Add policy for authenticated users to manage articles

  3. Indexes
    - Add index on slug for fast lookups
    - Add index on published_at for ordering
*/

CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text,
  content text,
  slug text UNIQUE NOT NULL,
  author text NOT NULL DEFAULT 'Miran Safiny',
  image_url text,
  tags text[],
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to articles
CREATE POLICY "Anyone can read articles"
  ON articles
  FOR SELECT
  TO public
  USING (true);

-- Policy for authenticated users to insert articles
CREATE POLICY "Authenticated users can insert articles"
  ON articles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for authenticated users to update articles
CREATE POLICY "Authenticated users can update articles"
  ON articles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for authenticated users to delete articles
CREATE POLICY "Authenticated users can delete articles"
  ON articles
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample articles
INSERT INTO articles (title, excerpt, content, slug, author, image_url, tags) VALUES
(
  'The Future of Renewable Energy in Kurdistan',
  'Exploring the potential of solar and wind energy solutions for sustainable development in the region.',
  'Kurdistan Region has tremendous potential for renewable energy development. With abundant sunshine throughout the year and strategic location, the region is positioned to become a leader in clean energy solutions...',
  'future-renewable-energy-kurdistan',
  'Miran Safiny',
  'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg',
  ARRAY['Renewable Energy', 'Kurdistan', 'Sustainability', 'Solar Power']
),
(
  'Real Estate Market Trends in Erbil 2024',
  'Analysis of current market conditions and future opportunities in Erbil''s property sector.',
  'The real estate market in Erbil continues to evolve with new developments and changing consumer preferences. This comprehensive analysis examines current trends, investment opportunities, and future projections...',
  'real-estate-trends-erbil-2024',
  'Miran Safiny',
  'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg',
  ARRAY['Real Estate', 'Erbil', 'Market Analysis', 'Investment']
),
(
  'Digital Marketing Strategies for Local Businesses',
  'How Kurdistan businesses can leverage digital channels to reach wider audiences and drive growth.',
  'In today''s digital age, local businesses in Kurdistan need to adapt their marketing strategies to remain competitive. This article explores effective digital marketing techniques tailored for the regional market...',
  'digital-marketing-local-businesses',
  'Miran Safiny',
  'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg',
  ARRAY['Digital Marketing', 'Business Growth', 'Strategy', 'Kurdistan']
);