/**
 * Generates public/sitemap.xml from static routes + Supabase articles (all locales).
 */
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

// Safely load local .env variables if running locally
function loadDotEnv() {
  const env = {}
  const p = path.join(root, '.env')
  if (!fs.existsSync(p)) return env
  try {
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^([^#=]+)=(.*)$/)
      if (!m) continue
      const k = m[1].trim()
      let v = m[2].trim()
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1)
      }
      env[k] = v
    }
  } catch (err) {
    console.warn('⚠️ Could not read .env file, relying on system environment variables.')
  }
  return env
}

const fileEnv = loadDotEnv()
const url = process.env.VITE_SUPABASE_DATABASE_URL || fileEnv.VITE_SUPABASE_DATABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY || fileEnv.VITE_SUPABASE_ANON_KEY
const SITE_URL = (process.env.SITE_URL || fileEnv.SITE_URL || 'https://miransafiny.com').replace(/\/$/, '')

const publicDir = path.join(root, 'public')
const outPath = path.join(publicDir, 'sitemap.xml')

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function urlEl(loc, lastmod, changefreq, priority, alternates = []) {
  const altTags = alternates.length > 0
    ? '\n' + alternates.map(alt => `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${xmlEscape(alt.url)}" />`).join('\n')
    : ''

  return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${altTags}
  </url>`
}

async function main() {
  console.log('🔄 Starting sitemap generation...')

  // 1. Ensure the public directory exists so writing the file doesn't fail
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
    console.log('📁 Created public directory.')
  }

  const langs = ['en', 'ar', 'ckb']
  const now = new Date().toISOString()
  const blocks = []

  // 2. Base Static Routes with Multilingual Hreflang Tags
  const staticAlternates = langs.map(l => ({ lang: l, url: `${SITE_URL}/${l}` }))
  const articlesAlternates = langs.map(l => ({ lang: l, url: `${SITE_URL}/${l}/articles` }))

  // Root URL
  blocks.push(urlEl(SITE_URL, now.split('T')[0], 'weekly', '1.0', staticAlternates))

  // Language Roots & Static Pages
  for (const lang of langs) {
    blocks.push(urlEl(`${SITE_URL}/${lang}`, now.split('T')[0], 'weekly', '1.0', staticAlternates))
    blocks.push(urlEl(`${SITE_URL}/${lang}/articles`, now.split('T')[0], 'daily', '0.9', articlesAlternates))
  }

  // 3. Fetch Dynamic Articles from Supabase
  let articleRows = []
  if (url && key) {
    const supabase = createClient(url, key)
    console.log('🌐 Fetching articles from Supabase...')
    
    const { data, error } = await supabase
      .from('articles')
      .select('slug, locale, updated_at, published_at')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('❌ Supabase fetch failed. Check your table structure and permissions:', error.message)
    } else {
      // Filter out drafts locally just in case the query fails on 'published_at'
      articleRows = (data || []).filter(article => article.published_at !== null)
      console.log(`✅ Fetched ${articleRows.length} published articles.`)
    }
  } else {
    console.warn('⚠️ Missing Supabase environment variables. Writing static URLs only.')
  }

  // 4. Process Articles
  const articlesBySlug = {}
  for (const row of articleRows) {
    if (!row.slug) continue
    if (!articlesBySlug[row.slug]) articlesBySlug[row.slug] = {}
    const loc = row.locale || 'en'
    articlesBySlug[row.slug][loc] = row
  }

  for (const [slug, localesObj] of Object.entries(articlesBySlug)) {
    const availableLangs = Object.keys(localesObj)
    const alternates = availableLangs.map(l => ({ 
      lang: l, 
      url: `${SITE_URL}/${l}/articles/${encodeURI(slug)}` 
    }))

    for (const [locale, row] of Object.entries(localesObj)) {
      const loc = `${SITE_URL}/${locale}/articles/${encodeURI(slug)}`
      const mod = row.updated_at || row.published_at || now
      const lastmod = typeof mod === 'string' ? mod.split('T')[0] : now.split('T')[0]
      blocks.push(urlEl(loc, lastmod, 'monthly', '0.7', alternates))
    }
  }

  // 5. Write the XML File
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${blocks.join('\n')}
</urlset>
`
  
  try {
    fs.writeFileSync(outPath, xml, 'utf8')
    console.log(`🎉 Sitemap successfully generated with ${blocks.length} URLs at ${outPath}`)
  } catch (writeErr) {
    console.error('❌ Failed to write sitemap.xml:', writeErr)
  }
}

main().catch((e) => {
  console.error('❌ Fatal Error during sitemap generation:', e)
  process.exit(1)
})