import React, { useEffect, useRef, useMemo } from 'react'
import { Target, Lightbulb, Users, Award } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const About: React.FC = () => {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement | null>(null)

  const highlights = useMemo(() => {
    const icons = [Target, Lightbulb, Users, Award]
    const raw = t('about.highlights', { returnObjects: true }) as { title: string; description: string }[]
    return raw.map((h, i) => ({ ...h, icon: icons[i] ?? Target }))
  }, [t])

  useEffect(() => {
    const root = sectionRef.current
    if (!root) return

    const els = Array.from(root.querySelectorAll('[data-reveal]')) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).classList.add('reveal-in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="py-16 sm:py-20 bg-white text-black">
      <style>{`
        [data-reveal]{
          opacity:0;
          transform: translate3d(-50px,0,0);
          will-change: transform, opacity;
        }
        [data-reveal].reveal-in{
          animation: revealLeft 900ms cubic-bezier(.2,.7,.2,1) var(--delay,0ms) forwards;
        }
        @keyframes revealLeft{
          to { opacity:1; transform: translate3d(0,0,0); }
        }
        @media (prefers-reduced-motion: reduce){
          [data-reveal]{ opacity:1 !important; transform:none !important; animation:none !important; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <h2
          data-reveal
          style={{ ['--delay' as string]: '0ms' } as React.CSSProperties}
          className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 sm:mb-10"
        >
          {t('about.heading')}
        </h2>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          <div>
            <p
              data-reveal
              style={{ ['--delay' as string]: '120ms' } as React.CSSProperties}
              className="text-base sm:text-lg mb-5 sm:mb-6 leading-relaxed"
            >
              {t('about.p1')}
            </p>

            <p
              data-reveal
              style={{ ['--delay' as string]: '220ms' } as React.CSSProperties}
              className="text-base sm:text-lg mb-7 sm:mb-8 leading-relaxed"
            >
              {t('about.p2')}
            </p>

            <div
              data-reveal
              style={{ ['--delay' as string]: '320ms' } as React.CSSProperties}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              <span className="px-3.5 sm:px-4 py-2 bg-black text-white text-xs sm:text-sm font-bold">{t('about.badge1')}</span>
              <span className="px-3.5 sm:px-4 py-2 bg-[#007BFF] text-white text-xs sm:text-sm font-bold">{t('about.badge2')}</span>
              <span className="px-3.5 sm:px-4 py-2 bg-black text-white text-xs sm:text-sm font-bold">{t('about.badge3')}</span>
              <span className="px-3.5 sm:px-4 py-2 bg-black text-white text-xs sm:text-sm font-bold">{t('about.badge4')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {highlights.map((item, i) => (
              <div
                key={item.title}
                data-reveal
                style={{ ['--delay' as string]: `${150 + i * 120}ms` } as React.CSSProperties}
                className="bg-zinc-100 p-5 sm:p-6 border border-black/10"
              >
                <div className="bg-black w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center mb-3.5 sm:mb-4">
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-black mb-1.5 sm:mb-2">{item.title}</h3>
                <p className="text-sm sm:text-[0.95rem] opacity-80 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
