import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Calendar, User, Search, ExternalLink } from 'lucide-react'
import { supabase, Article } from '../lib/supabase'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DEFAULT_LANG, isAppLang, localeToBcp47 } from '../utils/locale'

const ACCENT = '#007BFF'

// Skeleton
const SkeletonArticleCard: React.FC = () => (
  <div className="group bg-[#040404] shadow-lg overflow-hidden border border-white/10">
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#121212]" />
    <div className="p-4 sm:p-6">
      <div className="flex items-center text-[10px] sm:text-sm mb-3 gap-3">
        <div className="h-3.5 w-16 bg-white/10" />
        <div className="h-3.5 w-24 bg-white/10" />
      </div>
      <div className="h-5 bg-white/15 mb-3 w-3/4" />
      <div className="h-3.5 bg-white/10 mb-2 w-full" />
      <div className="h-3.5 bg-white/10 mb-4 w-5/6" />
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="h-5 w-14 bg-white/10" />
        <span className="h-5 w-16 bg-white/10" />
      </div>
      <div className="h-4 w-20 bg-white/15" />
    </div>
  </div>
)

const Articles: React.FC = () => {
  const { t } = useTranslation()
  const { lang: langParam } = useParams<{ lang?: string }>()
  const lang = isAppLang(langParam) ? langParam : DEFAULT_LANG

  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(6)
  const [totalArticles, setTotalArticles] = useState(0)

  const navigate = useNavigate()
  const location = useLocation()

  const chipRef = useRef<HTMLDivElement | null>(null)
  const cardsRef = useRef<Record<string, HTMLDivElement | null>>({})

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true)
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      await new Promise((r) => setTimeout(r, 120))

      let query = supabase
        .from('articles')
        .select('*', { count: 'exact' })
        .eq('locale', lang)
        .order('published_at', { ascending: false })
        .range(from, to)

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
      }

      const { data, error, count } = await query
      if (error) {
        setArticles([])
        setTotalArticles(0)
      } else {
        setArticles(data || [])
        setTotalArticles(count || 0)
      }
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, searchTerm, lang])

  useEffect(() => {
    void fetchArticles()
  }, [fetchArticles])
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSearchTerm(params.get('search') || '')
  }, [location.search])
  useEffect(() => {
    setPage(1)
  }, [searchTerm])

  const openArticle = (a: Article) => navigate(`/${lang}/articles/${a.slug}`)
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(localeToBcp47(lang), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  useEffect(() => {
    const el = chipRef.current
    if (!el) return
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => e.isIntersecting && el.classList.add('chip-animate'))
    }, { threshold: 1 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement
        if (entry.isIntersecting) { el.classList.add('card-in'); io.unobserve(el) }
      })
    }, { threshold: 0.2 })
    setTimeout(() => Object.values(cardsRef.current).forEach(el => el && io.observe(el)), 0)
    return () => io.disconnect()
  }, [articles, loading])

  return (
    <section id="articles" className="py-16 sm:py-20 bg-[#0b0b0b] text-[#eaeaea]">
      <style>{`
        .chip { position: relative; display: inline-block; }
        .chip > .chip-bg { position: absolute; inset: 0; background: ${ACCENT}; transform: translateX(-101%); }
        @keyframes chipWipe { from { transform: translateX(-101%) } to { transform: translateX(0) } }
        .chip-animate > .chip-bg { animation: chipWipe 1200ms cubic-bezier(.22,.9,.28,1) forwards; }
        .card-pre { opacity: 0; transform: translateX(80px) }
        @keyframes slideInRight { 0% { transform: translateX(80px); opacity: 0 } 100% { transform: translateX(0); opacity: 1 } }
        .card-in { animation: slideInRight 900ms cubic-bezier(.2,.7,.2,1) forwards }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading smaller on phones */}
        <div className="mb-7 sm:mb-10">
          <div ref={chipRef} className="chip">
            <span className="relative z-10 px-3 sm:px-6 py-2.5 sm:py-4 text-lg sm:text-4xl md:text-5xl font-black uppercase tracking-wider text-white select-none">
              {t('articles.heading')}
            </span>
            <span className="chip-bg" />
          </div>
        </div>

        {/* Search with extra blue bar underneath */}
        <div className="mb-7 sm:mb-10">
          <div className="relative">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
            <input
              type="text"
              placeholder={t('articles.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-2 py-3 bg-transparent text-white placeholder-white/40 outline-none border-none border-b-2"
              style={{ borderBottomColor: ACCENT }}
              aria-label="Search articles"
            />
          </div>
          {/* extra blue line */}
          <div className="h-[3px] w-full mt-1" style={{ background: ACCENT }} />
        </div>

        {/* Grid: 2 per row on phones, 3 on md+ */}
        <div className="mb-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {loading ? (
              Array.from({ length: pageSize }).map((_, i) => <SkeletonArticleCard key={i} />)
            ) : articles.length > 0 ? (
              articles.map((a, idx) => (
                <article
                  key={a.id}
                  ref={(el) => (cardsRef.current[String(a.id)] = el)}
                  className="group bg-[#040404] shadow-lg overflow-hidden border border-white/10 transition-all duration-300 card-pre hover:-translate-y-0.5 cursor-pointer"
                  style={{ animationDelay: `${idx * 100}ms` }}
                  onClick={() => openArticle(a)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 28px rgba(0,191,238,0.22)'
                    e.currentTarget.style.borderColor = 'rgba(0,191,238,.55)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = ''
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  }}
                >
                  {/* Image */}
                  <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#0f0f0f] overflow-hidden">
                    {a.image_url ? (
                      <img
                        src={a.image_url}
                        alt={a.featured_image_alt?.trim() || t('articles.cardImageAlt', { title: a.title })}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-500 filter grayscale saturate-0 group-hover:grayscale-0 group-hover:saturate-100 group-hover:scale-[1.04]"
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = 'https://placehold.co/800x500/0b0b0b/FFFFFF?text=Article'
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: ACCENT, opacity: 0.08 }}>
                        <span className="text-white/70 text-xs sm:text-lg">Article</span>
                      </div>
                    )}
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                  </div>

                  {/* Body – smaller on phones */}
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-wrap items-center text-[10px] sm:text-sm text-white/60 mb-2.5 sm:mb-3 gap-x-3 gap-y-2">
                      {a.author && (
                        <span className="inline-flex items-center">
                          <User className="h-3.5 w-3.5 mr-1" />
                          {a.author}
                        </span>
                      )}
                      {a.published_at && (
                        <span className="inline-flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {formatDate(a.published_at)}
                        </span>
                      )}
                    </div>

                    <h3
                      className="text-sm sm:text-xl font-bold leading-snug sm:leading-tight mb-1.5 sm:mb-3 line-clamp-2 group-hover:underline underline-offset-4 decoration-[color:var(--accent)]"
                      style={{ '--accent': ACCENT } as React.CSSProperties}
                    >
                      {a.title}
                    </h3>

                    {a.excerpt && (
                      <p className="text-white/70 mb-3 sm:mb-4 line-clamp-3 text-[12px] sm:text-base">
                        {a.excerpt}
                      </p>
                    )}

                    {a.tags && (
                      <div className="flex flex-wrap gap-2 mb-3 sm:mb-5">
                        {a.tags.slice(0, 2).map((tag, i2) => (
                          <span
                            key={i2}
                            className="px-2 py-[2px] sm:px-2.5 sm:py-1 text-[10px] sm:text-xs border bg-white/5"
                            style={{ color: ACCENT, borderColor: 'rgba(0,191,238,.5)' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={(e) => { e.stopPropagation(); openArticle(a) }}
                      className="inline-flex items-center font-semibold text-xs sm:text-base"
                      style={{ color: ACCENT }}
                      aria-label={`Read ${a.title}`}
                    >
                      {t('articles.readMore')}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-center py-12 col-span-full">
                <p className="text-white/60 text-lg">{t('articles.noResults')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalArticles > pageSize && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1 || loading}
              className="px-5 py-2 bg-[#040404] border border-white/10 text-white/90 disabled:opacity-50 hover:bg-white/5"
            >
              {t('articles.previous')}
            </button>
            <span className="text-white/60">
              {t('articles.page', {
                current: page,
                total: Math.max(1, Math.ceil(totalArticles / pageSize)),
              })}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page * pageSize >= totalArticles || loading}
              className="px-5 py-2 bg-[#040404] border border-white/10 text-white/90 disabled:opacity-50 hover:bg-white/5"
            >
              {t('articles.next')}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Articles
