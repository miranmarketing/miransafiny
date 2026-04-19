/**
 * Generates public/sitemap.xml from static routes + Supabase articles (all locales).
 * Requires VITE_SUPABASE_DATABASE_URL and VITE_SUPABASE_ANON_KEY (e.g. from .env).
 * Set SITE_URL=https://miransafiny.com for production URLs.
 */
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

function loadDotEnv() {
  const env = {}
  const p = path.join(root, '.env')
  if (!fs.existsSync(p)) return env
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
  return env
}

const fileEnv = loadDotEnv()
const url = process.env.VITE_SUPABASE_DATABASE_URL || fileEnv.VITE_SUPABASE_DATABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY || fileEnv.VITE_SUPABASE_ANON_KEY
const SITE_URL = (process.env.SITE_URL || fileEnv.SITE_URL || 'https://miransafiny.com').replace(/\/$/, '')

const outPath = path.join(root, 'public', 'sitemap.xml')

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function urlEl(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

async function main() {
  const staticPaths = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    ...['en', 'ar', 'ckb'].flatMap((lang) => [
      { path: `/${lang}`, priority: '1.0', changefreq: 'weekly' },
      { path: `/${lang}/articles`, priority: '0.9', changefreq: 'daily' },
    ]),
  ]

  let articleRows = []
  if (url && key) {
    const supabase = createClient(url, key)
    const { data, error } = await supabase.from('articles').select('slug, locale, updated_at, published_at')
    if (error) {
      console.warn('[sitemap] Supabase fetch failed:', error.message)
    } else {
      articleRows = data || []
    }
  } else {
    console.warn('[sitemap] Missing Supabase env — writing static URLs only. Add VITE_SUPABASE_* to .env for article URLs.')
  }

  const now = new Date().toISOString()
  const blocks = []

  for (const s of staticPaths) {
    const loc = s.path === '/' ? SITE_URL : `${SITE_URL}${s.path}`
    blocks.push(urlEl(loc, now.split('T')[0], s.changefreq, s.priority))
  }

  for (const row of articleRows) {
    const locale = row.locale || 'en'
    const slug = row.slug
    if (!slug) continue
    const loc = `${SITE_URL}/${locale}/articles/${encodeURI(slug)}`
    const mod = row.updated_at || row.published_at || now
    const lastmod = typeof mod === 'string' ? mod.split('T')[0] : now.split('T')[0]
    blocks.push(urlEl(loc, lastmod, 'monthly', '0.7'))
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${blocks.join('\n')}
</urlset>
`

  fs.writeFileSync(outPath, xml, 'utf8')
  console.log(`[sitemap] Wrote ${blocks.length} URLs → ${outPath}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
