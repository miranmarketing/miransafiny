import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_DATABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  image_url?: string
  author: string
  published_at: string
  created_at: string
  updated_at?: string
  slug: string
  tags?: string[]
  locale?: 'en' | 'ar' | 'ckb'
  translation_group_id?: string
  video_urls?: string[] | null
  featured_image_alt?: string | null
  /** If set, shown as hero instead of featured image */
  hero_video_url?: string | null
}


export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied'
  created_at: string
}
