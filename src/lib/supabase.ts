import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-project-url'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
console.log("SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL)
console.log("SUPABASE_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY)
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
  slug: string
  tags?: string[]
}
