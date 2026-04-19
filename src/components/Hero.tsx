import React, { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase, Article } from '../lib/supabase'
import { DEFAULT_LANG, isAppLang } from '../utils/locale'

const HEADER_H = 56 

const Hero: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang: langParam } = useParams<{ lang?: string }>()
  const lang = isAppLang(langParam) ? langParam : DEFAULT_LANG

  const [latest, setLatest] = useState<Article | null>(null)

  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
      document.documentElement.style.setProperty('--header-h', `${HEADER_H}px`)
    }
    setVH()
    window.addEventListener('resize', setVH)
    window.addEventListener('orientationchange', setVH)
    return () => {
      window.removeEventListener('resize', setVH)
      window.removeEventListener('orientationchange', setVH)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      const { data } = await supabase
        .from('articles')
        .select('*')
        .eq('locale', lang)
        .order('published_at', { ascending: false })
        .limit(1)
      if (!cancelled) setLatest(data?.[0] ?? null)
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [lang])

  const scrollToContact = () => {
    const el = document.querySelector('#contact')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const openLatest = () => {
    if (!latest?.slug) return
    navigate(`/${lang}/articles/${latest.slug}`)
  }

  return (
    <section
      id="home"
      className="relative flex items-end justify-center overflow-hidden bg-black text-white"
      style={{
        height: 'calc((var(--vh, 1vh) * 100) - var(--header-h, 56px))',
      }}
    >
      <div className="absolute inset-0 z-0">
        <div
          className="absolute left-0 right-0 bg-center bg-cover"
          style={{
            top: 'calc(var(--header-h, 56px) * -1)',
            height: 'calc(100% + var(--header-h, 56px))',
            filter: 'grayscale(100%)',
            backgroundImage: "url('/miran.png')",
          }}
        />
        <div
          className="absolute left-0 right-0 bg-black/60"
          style={{
            top: 'calc(var(--header-h, 56px) * -1)',
            height: 'calc(100% + var(--header-h, 56px))',
          }}
        />
      </div>

      <div
        className="relative z-10 w-full px-4 sm:px-6"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 56px)' }}
      >
        <div className="mx-auto max-w-4xl text-center">
          {/* CHANGED: tracking-widest -> ltr:tracking-widest rtl:tracking-normal */}
          <h2 className="mb-2 font-black ltr:tracking-widest rtl:tracking-normal text-white text-[clamp(0.95rem,3.4vw,1.25rem)]">
            {t('hero.name')}
          </h2>
          <p
            className="
              mx-auto font-black leading-tight text-white
              text-[clamp(1rem,4vw,2.25rem)]
              sm:text-[clamp(1.125rem,3.4vw,2.5rem)]
            "
            style={{ maxWidth: '36ch' }}
          >
            {t('hero.tagline')}
          </p>

          {latest && (
            <div className="mt-6 sm:mt-8 mx-auto max-w-lg text-start border border-white/20 bg-black/40 backdrop-blur-sm p-4 sm:p-5">
              {/* CHANGED: tracking-[0.2em] -> ltr:tracking-[0.2em] rtl:tracking-normal */}
              <p className="text-[10px] sm:text-xs font-bold ltr:tracking-[0.2em] rtl:tracking-normal text-[#007BFF] mb-2">
                {t('hero.latestArticle')}
              </p>
              <p className="font-bold text-sm sm:text-base text-white line-clamp-2">{latest.title}</p>
              {latest.excerpt && (
                <p className="mt-2 text-xs sm:text-sm text-white/75 line-clamp-2">{latest.excerpt}</p>
              )}
              {/* CHANGED: tracking-wider -> ltr:tracking-wider rtl:tracking-normal */}
              <button
                type="button"
                onClick={openLatest}
                className="mt-4 inline-flex items-center text-xs sm:text-sm font-bold uppercase ltr:tracking-wider rtl:tracking-normal text-[#007BFF] hover:underline"
              >
                {t('hero.readArticle')}
                <ArrowRight className="ms-2 h-4 w-4 rtl:-scale-x-100" />
              </button>
            </div>
          )}

          <div className="mt-5 sm:mt-6 flex justify-center">
            {/* CHANGED: tracking-wider -> ltr:tracking-wider rtl:tracking-normal */}
            <button
              onClick={scrollToContact}
              className="inline-flex items-center px-8 py-3 font-bold uppercase ltr:tracking-wider rtl:tracking-normal bg-[#007BFF] text-white"
            >
              {t('hero.cta')}
              <ArrowRight className="ms-2 h-5 w-5 rtl:-scale-x-100" />
            </button>
          </div>
        </div>
      </div>

      {/* CHANGED: tracking-widest -> ltr:tracking-widest rtl:tracking-normal */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 text-xs ltr:tracking-widest rtl:tracking-normal sm:bottom-4">
        {t('hero.scroll')}
      </div>

      <style>{`
        :root { --header-h: ${HEADER_H}px; }
        @supports (height: 100svh) {
          #home { height: calc(100svh - var(--header-h)); }
        }
        @supports (height: 100dvh) {
          #home { height: calc(100dvh - var(--header-h)); }
        }
      `}</style>
    </section>
  )
}

export default Hero