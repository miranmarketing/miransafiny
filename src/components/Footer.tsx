import React from 'react'
import { Linkedin, Instagram, Facebook, MessageSquare, ArrowUpRight, ArrowUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { DEFAULT_LANG, isAppLang } from '../utils/locale'

const ACCENT = '#007BFF'

type Social = { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; url: string; name: string }

const socialLinks: Social[] = [
  { icon: Linkedin, url: 'https://www.linkedin.com/in/miran-safiny-48b375229/', name: 'LinkedIn' },
  { icon: Instagram, url: 'https://instagram.com/miransafiny', name: 'Instagram' },
  { icon: Facebook, url: 'https://www.facebook.com/Miransafiny', name: 'Facebook' },
  { icon: MessageSquare, url: 'https://wa.me/9647504459704', name: 'WhatsApp' },
]

const Footer: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { lang: langParam } = useParams<{ lang?: string }>()
  const lang = isAppLang(langParam) ? langParam : DEFAULT_LANG

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const goSection = (hash: string) => {
    const id = hash.startsWith('#') ? hash.slice(1) : hash
    if (location.pathname === `/${lang}` || location.pathname === `/${lang}/`) {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      navigate(`/${lang}`, { state: { scrollTo: `#${id}` } })
    }
  }

  return (
    <footer className="relative text-white" style={{ background: 'black' }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60rem 30rem at 15% -10%, rgba(0,191,238,0.10), transparent 60%), radial-gradient(40rem 24rem at 90% 0%, rgba(0,191,238,0.07), transparent 60%)',
        }}
      />

      <button
        type="button"
        onClick={scrollToTop}
        aria-label={t('footer.backToTop')}
        className="group absolute -top-6 left-1/2 -translate-x-1/2 h-12 w-12 rounded-full shadow-xl flex items-center justify-center
                   ring-1 ring-white/15 transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4"
        style={{
          backgroundImage: `linear-gradient(180deg, ${ACCENT}, #35d7ff)`,
          boxShadow: '0 10px 30px rgba(0,191,238,0.35)',
        }}
      >
        <ArrowUp className="h-5 w-5 text-black" />
      </button>

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-10">
        <div className="grid md:grid-cols-4 gap-10 md:gap-12 mb-10">
          <div className="md:col-span-2">
            <div className="relative inline-block">
              <h3 className="text-2xl font-extrabold tracking-tight">Miran Safiny</h3>
              <span
                className="absolute left-0 -bottom-1 h-[6px] w-0 animate-[wipe_900ms_ease-out_forwards]"
                style={{ background: ACCENT }}
              />
            </div>
            <p className="mt-5 text-white/70 max-w-md">{t('footer.tagline')}</p>

            <div className="mt-6 flex gap-3">
              {socialLinks.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="group relative h-11 w-11  border border-white/10 bg-white/[0.04] flex items-center justify-center
                             transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4"
                  style={{ boxShadow: '0 0 0 2px rgba(255,255,255,0.04), inset 0 0 0 1px rgba(255,255,255,0.06)' }}
                >
                  <s.icon className="h-5 w-5 text-white/90 group-hover:text-white transition-colors" />
                  <span
                    className="pointer-events-none absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ boxShadow: `inset 0 0 0 2px ${ACCENT}` }}
                  />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold">{t('footer.quickLinks')}</h4>
            <div className="mt-4 grid grid-cols-1 gap-2">
              {[
                { key: 'about', hash: 'about' },
                { key: 'vision', hash: 'quote' },
                { key: 'achievements', hash: 'achievements' },
                { key: 'articles', hash: 'articles' },
                { key: 'contact', hash: 'contact' },
              ].map((q) => (
                <button
                  key={q.key}
                  type="button"
                  onClick={() => goSection(q.hash)}
                  className="group inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors focus:outline-none focus-visible:ring-4 "
                >
                  <span className="underline decoration-transparent group-hover:decoration-current underline-offset-4">
                    {t(`footer.${q.key}`)}
                  </span>
                  <ArrowUpRight className="h-4 w-4 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold">{t('footer.contactSection')}</h4>
            <div className="mt-4 space-y-2 text-white/70">
              <p>{t('footer.erbil')}</p>
              <p>{t('footer.iraq')}</p>
              <a href="mailto:info@miransafiny.com" className="hover:text-white transition-colors">
                info@miransafiny.com
              </a>
              <br />
              <a href="https://wa.me/9647504459704" className="hover:text-white transition-colors">
                +964 750 445 9704
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/60">{t('footer.rights', { year: new Date().getFullYear() })}</p>
          <nav className="flex gap-6 text-sm text-white/60">
            <a href="#" className="hover:text-white transition-colors">
              {t('footer.privacy')}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {t('footer.terms')}
            </a>
            <a href="/sitemap.xml" className="hover:text-white transition-colors">
              {t('footer.sitemap')}
            </a>
          </nav>
        </div>
      </div>

      <style>{`
        @keyframes wipe { from { width: 0 } to { width: 100% } }
      `}</style>
    </footer>
  )
}

export default Footer
