import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase, Article } from '../lib/supabase'
import { Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, Clock } from 'lucide-react'

const ACCENT = '##007BFF'

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [article, setArticle] = useState<Article | null>(null)
  const [related, setRelated] = useState<Article[]>([])
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [copied, setCopied] = useState(false)

  // Helpers
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const readingTime = useMemo(() => {
    if (!article?.content) return null
    const text = article.content.replace(/<[^>]*>/g, ' ')
    const words = text.trim().split(/\s+/).length
    const mins = Math.max(1, Math.round(words / 200))
    return mins
  }, [article?.content])

  const shareText = article
    ? `Check out this article: ${article.title} – ${currentUrl}`
    : `Check out this article: ${currentUrl}`

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(currentUrl)
      } else {
        const el = document.createElement('textarea')
        el.value = currentUrl
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  // Fetch article
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    let cancelled = false
    const run = async () => {
      if (!slug) return
      const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single()
      if (cancelled) return
      if (error) {
        console.error('Error fetching article:', error)
        setArticle(null)
      } else {
        setArticle(data as Article)
      }
    }
    run()
    return () => { cancelled = true }
  }, [slug])

  // Fetch related
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!article?.slug) return

      try {
        const base = supabase.from('articles').select('*').neq('slug', article.slug)
        let query = base
        // @ts-expect-error optional category
        if (article.category) query = query.eq('category', (article as any).category)
        else if (article.author) query = query.eq('author', article.author)

        const { data, error } = await query.order('published_at', { ascending: false }).limit(6)
        if (cancelled) return
        if (error) {
          console.warn('Related fetch fallback (recent):', error.message)
          const { data: recent } = await base.order('published_at', { ascending: false }).limit(6)
          setRelated(recent || [])
        } else {
          setRelated(data || [])
        }
      } catch (err) {
        console.error(err)
      }
    }
    run()
    return () => { cancelled = true }
  }, [article?.slug])

  // Meta tags (OG/Twitter) – client-side best effort (edge function SSR is ideal)
  useEffect(() => {
    const head = document.head
    const update = (prop: string, content: string, attr: 'property' | 'name' = 'property') => {
      let tag = head.querySelector(`meta[${attr}="${prop}"]`) as HTMLMetaElement | null
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attr, prop)
        head.appendChild(tag)
      }
      tag.content = content
    }
    const remove = (prop: string, attr: 'property' | 'name' = 'property') => {
      const tag = head.querySelector(`meta[${attr}="${prop}"]`)
      tag && head.removeChild(tag)
    }

    document.title = article ? `${article.title} — Miran Safiny` : 'Loading — Miran Safiny'
    const url = typeof window !== 'undefined' ? window.location.href : ''

    if (article) {
      update('og:title', article.title)
      update('og:description', article.excerpt || '')
      update('og:image', article.image_url || `${window.location.origin}/default-share-image.jpg`)
      update('og:url', url)
      update('og:type', 'article')
      update('og:site_name', 'Miran Safiny')

      update('twitter:card', 'summary_large_image', 'name')
      update('twitter:site', '@miran_safiny', 'name')
      update('twitter:creator', '@miran_safiny', 'name')
      update('twitter:title', article.title, 'name')
      update('twitter:description', article.excerpt || '', 'name')
      update('twitter:image', article.image_url || `${window.location.origin}/default-share-image.jpg`, 'name')
    }

    return () => {
      ;[
        ['og:title','property'], ['og:description','property'], ['og:image','property'],
        ['og:url','property'], ['og:type','property'], ['og:site_name','property'],
        ['twitter:card','name'], ['twitter:site','name'], ['twitter:creator','name'],
        ['twitter:title','name'], ['twitter:description','name'], ['twitter:image','name']
      ].forEach(([p, a]) => remove(p, a as 'property' | 'name'))
      document.title = 'Miran Safiny'
    }
  }, [article])

  if (!article) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-24">
        <div className="flex items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/60" />
          <p className="text-base">Loading article…</p>
        </div>
      </div>
    )
  }

  const dateStr = article.published_at
    ? new Date(article.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : ''

  return (
    <section className="bg-black text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Grid: content + sidebar */}
        <div className="grid lg:grid-cols-12 gap-10">
          {/* MAIN */}
          <article className="lg:col-span-8">
            {/* Title */}
            <header className="mb-6">
              <div className="relative inline-block">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight">{article.title}</h1>
                <span className="absolute left-0 -bottom-1 h-[6px] w-0 animate-[wipe_900ms_ease-out_forwards]" style={{ background: ACCENT }} />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-white/70">
                {article.author && <span className="uppercase tracking-wide text-xs">By {article.author}</span>}
                {dateStr && <span className="text-white/50">• {dateStr}</span>}
                {typeof readingTime === 'number' && (
                  <span className="flex items-center gap-1 text-white/60">
                    <Clock className="h-4 w-4" /> {readingTime} min read
                  </span>
                )}
              </div>
            </header>

            {/* Hero image (BW -> color on hover) */}
            {article.image_url ? (
              <figure className="group mb-8 relative aspect-[16/9] bg-white/[0.03] border border-white/10 overflow-hidden">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className={[
                    'absolute inset-0 h-full w-full object-cover',
                    'filter none saturate-100 transition-all duration-500',
                    'group-hover:grayscale-0 group-hover:saturate-100 group-hover:scale-[1.02]'
                  ].join(' ')}
                  style={{ willChange: 'transform, filter' }}
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = `https://placehold.co/1200x675/0b0b0b/ffffff?text=Miran+Safiny`
                  }}
                />
                <span className="absolute top-0 left-0 h-[2px] w-20" style={{ background: ACCENT }} />
                <span className="absolute bottom-0 right-0 h-[2px] w-20" style={{ background: ACCENT }} />
              </figure>
            ) : (
              <div className="mb-8 relative aspect-[16/9] bg-white/[0.03] border border-white/10 overflow-hidden flex items-center justify-center">
                <span className="text-white/50">No image available</span>
                <span className="absolute top-0 left-0 h-[2px] w-20" style={{ background: ACCENT }} />
                <span className="absolute bottom-0 right-0 h-[2px] w-20" style={{ background: ACCENT }} />
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-invert max-w-none prose-headings:font-bold prose-a:text-[color:var(--accent)] text-lg"
              style={{ ['--accent' as any]: ACCENT }}
            >
              <div dangerouslySetInnerHTML={{ __html: article.content || '' }} />
            </div>

            {/* Share */}
            <div className="mt-10 pt-6 border-top border-white/10">
              <button
                onClick={() => setShowShareOptions((v) => !v)}
                className="inline-flex items-center gap-2 px-4 py-2 font-semibold"
                style={{ backgroundImage: `linear-gradient(90deg, ${ACCENT}, #35d7ff)`, color: 'white' }}
              >
                <Share2 className="h-5 w-5" /> Share
              </button>

              {showShareOptions && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-[#25D366] text-white"
                    aria-label="Share on WhatsApp"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5" fill="currentColor">
                      <path d="M19.11 17.52c-.27-.14-1.56-.77-1.8-.86-.24-.09-.41-.14-.58.14-.17.27-.66.86-.81 1.04-.15.18-.3.21-.57.07-.27-.14-1.12-.41-2.14-1.31-.79-.7-1.32-1.57-1.47-1.84-.15-.27-.02-.41.11-.54.11-.11.24-.28.36-.42.12-.14.15-.24.23-.4.08-.16.04-.3-.02-.42-.06-.12-.58-1.4-.8-1.92-.21-.5-.42-.43-.58-.44l-.5-.01c-.17 0-.44.06-.67.3-.23.24-.88.86-.88 2.1s.9 2.44 1.02 2.61c.12.17 1.77 2.7 4.3 3.79.6.26 1.06.41 1.42.52.59.19 1.12.16 1.54.1.47-.07 1.56-.64 1.78-1.25.22-.61.22-1.13.15-1.24-.06-.11-.24-.18-.5-.31z" />
                      <path d="M16.03 5C10.5 5 6 9.5 6 15.03c0 2.06.68 3.97 1.84 5.5L7 26l5.59-1.76a10 10 0 0 0 3.44.6C21.55 24.84 26 20.35 26 14.82 26 9.5 21.55 5 16.03 5zm0 17.89c-1.2 0-2.31-.29-3.29-.8l-.24-.12-3.37 1.06 1.1-3.28-.15-.25a7.87 7.87 0 0 1-1.25-4.27c0-4.35 3.54-7.88 7.88-7.88s7.88 3.26 7.88 7.88c0 4.34-3.53 7.88-7.88 7.88z" />
                    </svg>
                  </a>

                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-[#1877F2] text-white"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-[#1DA1F2] text-white"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>

                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-[#0A66C2] text-white"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>

                  <button
                    onClick={copyToClipboard}
                    className="w-10 h-10 flex items-center justify-center bg-white text-black"
                    aria-label="Copy link"
                    title="Copy link"
                  >
                    <LinkIcon className="w-5 h-5" />
                  </button>

                  <span className={`ml-2 text-sm transition-opacity ${copied ? 'opacity-100' : 'opacity-0'}`} style={{ color: ACCENT }}>
                    Link copied
                  </span>
                </div>
              )}
            </div>
          </article>

          {/* SIDEBAR: Related */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="mb-4">
                <h2 className="text-lg font-extrabold tracking-tight">Related Articles</h2>
                <div className="h-[3px] w-16 mt-2" style={{ background: ACCENT }} />
              </div>

              {related.length === 0 && (
                <div className="text-white/60 text-sm">No related articles yet.</div>
              )}

              <ul className="space-y-4">
                {related.map((r) => {
                  const rDate = r.published_at
                    ? new Date(r.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                    : ''
                  return (
                    <li key={r.slug}>
                      <button onClick={() => navigate(`/articles/${r.slug}`)} className="group w-full text-left">
                        <div className="grid grid-cols-3 gap-3 items-center">
                          {/* Thumbnail (BW -> color on hover) */}
                          <div className="col-span-1 relative aspect-[4/3] bg-white/[0.03] border border-white/10 overflow-hidden">
                            <img
                              src={r.image_url || `https://placehold.co/400x300/0b0b0b/ffffff?text=Article`}
                              alt={r.title}
                              className={[
                                'absolute inset-0 h-full w-full object-cover transition-all duration-300',
                                'filter grayscale saturate-0',
                                'group-hover:grayscale-0 group-hover:saturate-100 group-hover:scale-[1.03]'
                              ].join(' ')}
                              style={{ willChange: 'transform, filter' }}
                            />
                            <span className="absolute top-0 left-0 h-[2px] w-8" style={{ background: ACCENT }} />
                          </div>

                          <div className="col-span-2">
                            <h3
                              className="text-sm font-semibold leading-snug group-hover:underline decoration-[color:var(--accent)] underline-offset-4"
                              style={{ ['--accent' as any]: ACCENT }}
                            >
                              {r.title}
                            </h3>
                            <div className="mt-1 text-xs text-white/60">{rDate}</div>
                            {r.excerpt && <p className="mt-1 text-xs text-white/60 line-clamp-2">{r.excerpt}</p>}
                          </div>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* Local styles */}
      <style>{`
        @keyframes wipe { from { width: 0 } to { width: 100% } }

        /* OPTIONAL: make any images inside the rich text go BW -> color on hover */
        .prose img {
          filter: grayscale(100%) saturate(0);
          transition: filter .35s ease, transform .35s ease;
        }
        .prose img:hover {
          filter: none saturate(100%);
          transform: translateZ(0);
        }
      `}</style>
    </section>
  )
}

export default ArticleDetail
