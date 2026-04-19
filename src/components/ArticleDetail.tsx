import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import DOMPurify from 'dompurify'
import { supabase, Article } from '../lib/supabase'
import { Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, Clock } from 'lucide-react'
import { DEFAULT_LANG, isAppLang, isRtl, localeToBcp47 } from '../utils/locale'
import { toEmbedUrl } from '../utils/embedUrl'
import { ensureImgAltAttributes } from '../utils/htmlImages'

const ACCENT = '#007BFF'
const SITE_ORIGIN = 'https://miransafiny.com'

const purifyOpts: Parameters<typeof DOMPurify.sanitize>[1] = {
  ADD_TAGS: ['iframe', 'figure', 'figcaption'],
  ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'src', 'title', 'loading', 'referrerpolicy', 'alt'],
}

const ArticleDetail: React.FC = () => {
  const { t } = useTranslation()
  const { slug, lang: langParam } = useParams<{ slug: string; lang?: string }>()
  const navigate = useNavigate()
  const lang = isAppLang(langParam) ? langParam : DEFAULT_LANG
  const rtl = isRtl(lang)

  const [article, setArticle] = useState<Article | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ok' | 'missing'>('loading')
  const [related, setRelated] = useState<Article[]>([])
  const [alternates, setAlternates] = useState<{ locale: string; slug: string }[]>([])
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [copied, setCopied] = useState(false)

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  const safeHtml = useMemo(() => {
    if (!article?.content) return ''
    const raw = DOMPurify.sanitize(article.content, purifyOpts)
    return ensureImgAltAttributes(raw, article.featured_image_alt || article.title)
  }, [article?.content, article?.featured_image_alt, article?.title])

  const readingTime = useMemo(() => {
    if (!article?.content) return null
    const text = article.content.replace(/<[^>]*>/g, ' ')
    const words = text.trim().split(/\s+/).length
    return Math.max(1, Math.round(words / 200))
  }, [article?.content])

  const shareText = article
    ? `${article.title} — ${currentUrl}`
    : currentUrl

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    let cancelled = false
    const run = async () => {
      if (!slug) return
      setLoadState('loading')
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('locale', lang)
        .maybeSingle()
      if (cancelled) return
      if (error || !data) {
        console.error('Error fetching article:', error)
        setArticle(null)
        setLoadState('missing')
      } else {
        setArticle(data as Article)
        setLoadState('ok')
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [slug, lang])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!article?.translation_group_id) {
        setAlternates([])
        return
      }
      const { data } = await supabase
        .from('articles')
        .select('locale, slug')
        .eq('translation_group_id', article.translation_group_id)
      if (cancelled) return
      setAlternates((data as { locale: string; slug: string }[]) || [])
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [article?.translation_group_id])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!article?.slug) return

      try {
        const base = supabase
          .from('articles')
          .select('*')
          .neq('slug', article.slug)
          .eq('locale', lang)
        const query = article.author ? base.eq('author', article.author) : base

        const { data, error } = await query.order('published_at', { ascending: false }).limit(6)
        if (cancelled) return
        if (error) {
          const { data: recent } = await base.order('published_at', { ascending: false }).limit(6)
          setRelated(recent || [])
        } else {
          setRelated(data || [])
        }
      } catch (err) {
        console.error(err)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [article?.slug, article?.author, lang])

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  const jsonLd = useMemo(() => {
    if (!article) return null
    const base = typeof window !== 'undefined' ? window.location.origin : SITE_ORIGIN
    const published = article.published_at || article.created_at
    const modified = article.updated_at || published
    const imgUrl = article.image_url
      ? article.image_url.startsWith('http')
        ? article.image_url
        : `${typeof window !== 'undefined' ? window.location.origin : SITE_ORIGIN}${article.image_url}`
      : `${SITE_ORIGIN}/miran.png`
    const keywords = (article.tags || []).join(', ')
    const blog: Record<string, unknown> = {
      '@type': 'BlogPosting',
      '@id': `${currentUrl}#blogposting`,
      headline: article.title,
      description: article.excerpt || article.title,
      image: {
        '@type': 'ImageObject',
        url: imgUrl,
        caption: article.featured_image_alt || article.title,
      },
      datePublished: published,
      dateModified: modified,
      author: {
        '@type': 'Person',
        name: article.author || 'Miran Safiny',
        url: SITE_ORIGIN,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Miran Safiny',
        url: SITE_ORIGIN,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_ORIGIN}/miran.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': currentUrl,
      },
      inLanguage: localeToBcp47(lang),
      isAccessibleForFree: true,
      keywords: keywords || undefined,
    }
    const crumbs = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/${lang}` },
        { '@type': 'ListItem', position: 2, name: 'Articles', item: `${base}/${lang}/articles` },
        { '@type': 'ListItem', position: 3, name: article.title, item: currentUrl },
      ],
    }
    return {
      '@context': 'https://schema.org',
      '@graph': [blog, crumbs],
    }
  }, [article, currentUrl, lang])

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
      if (tag) head.removeChild(tag)
    }
    document.title = article ? `${article.title} — Miran Safiny` : 'Miran Safiny'
    const url = typeof window !== 'undefined' ? window.location.href : ''

    if (article) {
      const root = window.location.origin
      const ogImage = article.image_url
        ? article.image_url.startsWith('http')
          ? article.image_url
          : `${root}${article.image_url.startsWith('/') ? '' : '/'}${article.image_url}`
        : `${root}/miran.png`

      update('description', article.excerpt || article.title, 'name')
      if (article.tags?.length) {
        update('keywords', article.tags.join(', '), 'name')
      } else {
        remove('keywords', 'name')
      }
      update('og:title', article.title)
      update('og:description', article.excerpt || '')
      update('og:image', ogImage)
      update('og:url', url)
      update('og:type', 'article')
      update('og:site_name', 'Miran Safiny')
      update('og:locale', localeToBcp47(lang).replace('-', '_'))

      update('twitter:card', 'summary_large_image', 'name')
      update('twitter:title', article.title, 'name')
      update('twitter:description', article.excerpt || '', 'name')
      update('twitter:image', ogImage, 'name')

      const can = document.createElement('link')
      can.setAttribute('rel', 'canonical')
      can.href = url
      can.dataset.articleCanonical = '1'
      head.appendChild(can)

      alternates.forEach((a) => {
        const hrefLang = a.locale === 'ckb' ? 'ckb' : a.locale
        const link = document.createElement('link')
        link.setAttribute('rel', 'alternate')
        link.setAttribute('hreflang', hrefLang)
        link.href = `${origin}/${a.locale}/articles/${a.slug}`
        link.dataset.articleAlt = '1'
        head.appendChild(link)
      })
      const xDefault = document.createElement('link')
      xDefault.setAttribute('rel', 'alternate')
      xDefault.setAttribute('hreflang', 'x-default')
      const enAlt = alternates.find((a) => a.locale === 'en')
      xDefault.href = enAlt
        ? `${origin}/en/articles/${enAlt.slug}`
        : `${origin}/${lang}/articles/${article.slug}`
      xDefault.dataset.articleAlt = '1'
      head.appendChild(xDefault)
    }

    return () => {
      ;[
        ['description', 'name'],
        ['keywords', 'name'],
        ['og:title', 'property'],
        ['og:description', 'property'],
        ['og:image', 'property'],
        ['og:url', 'property'],
        ['og:type', 'property'],
        ['og:site_name', 'property'],
        ['og:locale', 'property'],
        ['twitter:card', 'name'],
        ['twitter:title', 'name'],
        ['twitter:description', 'name'],
        ['twitter:image', 'name'],
      ].forEach(([p, a]) => remove(p, a as 'property' | 'name'))
      head.querySelectorAll('link[data-article-alt="1"]').forEach((el) => el.remove())
      head.querySelectorAll('link[data-article-canonical="1"]').forEach((el) => el.remove())
      document.title = 'Miran Safiny'
    }
  }, [article, alternates, origin, lang])

  useEffect(() => {
    if (!jsonLd) return
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.dataset.articleJsonLd = '1'
    s.text = JSON.stringify(jsonLd)
    document.head.appendChild(s)
    return () => {
      document.head.querySelectorAll('script[data-article-json-ld="1"]').forEach((el) => el.remove())
    }
  }, [jsonLd])

  if (loadState === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-24">
        <div className="flex items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/60" />
          <p className="text-base">{t('article.loading')}</p>
        </div>
      </div>
    )
  }

  if (loadState === 'missing' || !article) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center pt-24 px-6">
        <p className="text-lg text-white/80">{t('article.notFound')}</p>
        <button
          type="button"
          onClick={() => navigate(`/${lang}/articles`)}
          className="mt-4 text-[#007BFF] underline"
        >
          {t('articles.heading')}
        </button>
      </div>
    )
  }

  const dateStr = article.published_at
    ? new Date(article.published_at).toLocaleDateString(localeToBcp47(lang), {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : ''

  const heroEmbed = article.hero_video_url ? toEmbedUrl(article.hero_video_url) : null
  const featuredAlt = article.featured_image_alt?.trim() || article.title
  const allEmbedVideos = (article.video_urls || []).map(toEmbedUrl).filter(Boolean) as string[]
  const bodyVideos = heroEmbed ? allEmbedVideos.filter((v) => v !== heroEmbed) : allEmbedVideos

  return (
    <section className="bg-black text-white pt-24 pb-16" dir={rtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-10">
          <article className="lg:col-span-8">
            <header className="mb-6">
              <div className="relative inline-block">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight">{article.title}</h1>
                <span
                  className="absolute left-0 -bottom-1 h-[6px] w-0 animate-[wipe_900ms_ease-out_forwards]"
                  style={{ background: ACCENT }}
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-white/70">
                {article.author && (
                  <span className="uppercase tracking-wide text-xs">
                    {t('article.by')} {article.author}
                  </span>
                )}
                {dateStr && <span className="text-white/50">• {dateStr}</span>}
                {typeof readingTime === 'number' && (
                  <span className="flex items-center gap-1 text-white/60">
                    <Clock className="h-4 w-4" /> {t('article.minRead', { n: readingTime })}
                  </span>
                )}
              </div>
            </header>

            {heroEmbed ? (
              <figure className="mb-8 relative aspect-video w-full border border-white/10 overflow-hidden bg-black">
                <iframe
                  src={heroEmbed}
                  className="absolute inset-0 h-full w-full"
                  title={t('article.heroVideoTitle')}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="eager"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
                <span className="absolute top-0 left-0 h-[2px] w-20 pointer-events-none" style={{ background: ACCENT }} />
                <span className="absolute bottom-0 right-0 h-[2px] w-20 pointer-events-none" style={{ background: ACCENT }} />
              </figure>
            ) : article.image_url ? (
              <figure className="group mb-8 relative aspect-[16/9] bg-white/[0.03] border border-white/10 overflow-hidden">
                <img
                  src={article.image_url}
                  alt={featuredAlt}
                  className={[
                    'absolute inset-0 h-full w-full object-cover',
                    'filter none saturate-100 transition-all duration-500',
                    'group-hover:grayscale-0 group-hover:saturate-100 group-hover:scale-[1.02]',
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
                <span className="text-white/50">{t('article.noImage')}</span>
                <span className="absolute top-0 left-0 h-[2px] w-20" style={{ background: ACCENT }} />
                <span className="absolute bottom-0 right-0 h-[2px] w-20" style={{ background: ACCENT }} />
              </div>
            )}

            {bodyVideos.length > 0 && (
              <div className="mb-10 space-y-6">
                {bodyVideos.map((src) => (
                  <div
                    key={src}
                    className="relative aspect-video w-full overflow-hidden border border-white/10 bg-black"
                  >
                    <iframe
                      src={src}
                      className="absolute inset-0 h-full w-full"
                      title={article.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                ))}
              </div>
            )}

            <div
              className={[
                'article-body prose prose-invert max-w-none',
                'prose-headings:font-black prose-headings:tracking-tight',
                'prose-p:text-[1.05rem] prose-p:leading-relaxed md:prose-p:text-[1.125rem]',
                'prose-a:text-[#007BFF] prose-a:no-underline hover:prose-a:underline',
                'prose-blockquote:border-[#007BFF] prose-blockquote:text-white/90',
                'prose-figure:my-8 prose-img:rounded-sm prose-img:border prose-img:border-white/10',
                rtl ? 'text-right' : 'text-left',
              ].join(' ')}
            >
              <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
            </div>

            <div className="mt-10 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowShareOptions((v) => !v)}
                className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-white"
                style={{ backgroundImage: `linear-gradient(90deg, ${ACCENT}, #35d7ff)` }}
              >
                <Share2 className="h-5 w-5" /> {t('article.share')}
              </button>

              {showShareOptions && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-[#25D366] text-white"
                    aria-label="WhatsApp"
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
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-[#1DA1F2] text-white"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>

                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-[#0A66C2] text-white"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => void copyToClipboard()}
                    className="w-10 h-10 flex items-center justify-center bg-white text-black"
                    aria-label="Copy link"
                    title="Copy link"
                  >
                    <LinkIcon className="w-5 h-5" />
                  </button>

                  <span
                    className={`ml-2 text-sm transition-opacity ${copied ? 'opacity-100' : 'opacity-0'}`}
                    style={{ color: ACCENT }}
                  >
                    {t('article.linkCopied')}
                  </span>
                </div>
              )}
            </div>
          </article>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight">{t('article.related')}</h2>
                <div className="h-[3px] w-16 mt-2" style={{ background: ACCENT }} />
              </div>

              {related.length === 0 && (
                <div className="text-white/60 text-sm">{t('article.noneRelated')}</div>
              )}

              <ul className="space-y-4">
                {related.map((r) => {
                  const rDate = r.published_at
                    ? new Date(r.published_at).toLocaleDateString(localeToBcp47(lang), {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : ''
                  return (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => navigate(`/${lang}/articles/${r.slug}`)}
                        className="group w-full text-left"
                      >
                        <div className="grid grid-cols-3 gap-3 items-center">
                          <div className="col-span-1 relative aspect-[4/3] bg-white/[0.03] border border-white/10 overflow-hidden">
                            <img
                              src={r.image_url || `https://placehold.co/400x300/0b0b0b/ffffff?text=Article`}
                              alt={r.featured_image_alt?.trim() || r.title}
                              className={[
                                'absolute inset-0 h-full w-full object-cover transition-all duration-300',
                                'filter grayscale saturate-0',
                                'group-hover:grayscale-0 group-hover:saturate-100 group-hover:scale-[1.03]',
                              ].join(' ')}
                              style={{ willChange: 'transform, filter' }}
                            />
                            <span className="absolute top-0 left-0 h-[2px] w-8" style={{ background: ACCENT }} />
                          </div>

                          <div className="col-span-2">
                            <h3
                              className="text-sm font-semibold leading-snug group-hover:underline decoration-[#007BFF] underline-offset-4"
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

      <style>{`
        @keyframes wipe { from { width: 0 } to { width: 100% } }
        .article-body.prose img {
          filter: grayscale(100%) saturate(0);
          transition: filter .35s ease, transform .35s ease;
        }
        .article-body.prose img:hover {
          filter: none saturate(100%);
          transform: translateZ(0);
        }
      `}</style>
    </section>
  )
}

export default ArticleDetail
