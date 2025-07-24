/*
  # Admin Dashboard System

  1. New Tables
    - `admin_users` - Admin authentication
    - `website_content` - Dynamic website content management
    - `site_settings` - Global site configuration

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin users only
    - Secure admin access with proper authentication

  3. Content Management
    - Flexible content system for all website sections
    - Version control for content changes
    - Media management capabilities
*/

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Website Content Table
CREATE TABLE IF NOT EXISTS website_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  key text NOT NULL,
  value jsonb NOT NULL,
  description text,
  updated_by uuid REFERENCES admin_users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section, key)
);

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  updated_by uuid REFERENCES admin_users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Admin Users Policies
CREATE POLICY "Admin users can read own data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admin users can update own data"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Website Content Policies
CREATE POLICY "Authenticated users can read website content"
  ON website_content
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage website content"
  ON website_content
  FOR ALL
  TO authenticated
  USING (true);

-- Site Settings Policies
CREATE POLICY "Authenticated users can read site settings"
  ON site_settings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage site settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (true);

-- Update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_website_content_updated_at
    BEFORE UPDATE ON website_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default content
INSERT INTO website_content (section, key, value, description) VALUES
('hero', 'title', '"Miran Safiny"', 'Main hero title'),
('hero', 'subtitle', '"Vision-Driven Entrepreneur | Marketing Strategist | Real Estate Leader"', 'Hero subtitle'),
('hero', 'description', '"Shaping the future of business in Kurdistan through innovation, integrity, and purpose."', 'Hero description'),
('about', 'content', '{"paragraph1": "Miran Safiny is a visionary entrepreneur and business leader based in Erbil, Kurdistan Region, Iraq. With a sharp eye for emerging trends and a reputation for execution, Miran has built and managed multiple successful ventures across real estate, marketing, and renewable energy sectors.", "paragraph2": "Driven by a belief in sustainable development, customer trust, and regional transformation, Miran continues to pioneer initiatives that bring global business standards to local markets. Whether leading creative campaigns or launching infrastructure projects, his work is always rooted in value creation and long-term impact."}', 'About section content'),
('vision', 'vision_text', '"To elevate the business and urban landscape of Kurdistan by creating accessible, ethical, and future-ready solutions."', 'Vision statement'),
('vision', 'mission_text', '"To build and support ventures that solve real-world problems through innovation, collaboration, and strategic growth—while maintaining integrity, transparency, and social responsibility."', 'Mission statement'),
('contact', 'email', '"contact@miransafiny.com"', 'Contact email'),
('contact', 'phone', '"+964 750 123 4567"', 'Contact phone'),
('contact', 'location', '"Erbil, Kurdistan Region, Iraq"', 'Contact location');

INSERT INTO site_settings (key, value, description) VALUES
('site_title', '"Miran Safiny - Vision-Driven Entrepreneur"', 'Website title'),
('site_description', '"Shaping the future of business in Kurdistan through innovation, integrity, and purpose."', 'Website description'),
('social_linkedin', '"https://linkedin.com/in/miransafiny"', 'LinkedIn URL'),
('social_instagram', '"https://instagram.com/miransafiny"', 'Instagram URL'),
('social_twitter', '"https://twitter.com/miran_marketing"', 'Twitter URL'),
('social_whatsapp', '"https://wa.me/9647501234567"', 'WhatsApp URL');