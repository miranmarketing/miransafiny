import React, { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'

const HEADER_H = 56 // matches h-14

const Hero: React.FC = () => {
  // real viewport height polyfill (mobile browsers)
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

  const scrollToContact = () => {
    const el = document.querySelector('#contact')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className="relative flex items-end justify-center overflow-hidden bg-black text-white"
      // keep section strictly within viewport height minus header
      style={{
        height: 'calc((var(--vh, 1vh) * 100) - var(--header-h, 56px))',
      }}
    >
      {/* Background: extend UNDER the fixed header */}
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

      {/* Content (unchanged aside from safe bottom padding) */}
      <div
        className="relative z-10 w-full px-4 sm:px-6"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 56px)' }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-2 font-black tracking-widest text-white text-[clamp(0.95rem,3.4vw,1.25rem)]">
            MIRAN SAFINY
          </h2>
          <p
            className="
              mx-auto font-black leading-tight text-white
              text-[clamp(1rem,4vw,2.25rem)]
              sm:text-[clamp(1.125rem,3.4vw,2.5rem)]
            "
            style={{ maxWidth: '36ch' }}
          >
            VISION-DRIVEN ENTREPRENEUR, MARKETING STRATEGIST, &amp; REAL ESTATE LEADER
          </p>
          <div className="mt-5 sm:mt-6 flex justify-center">
            <button
              onClick={scrollToContact}
              className="inline-flex items-center px-8 py-3 font-bold uppercase tracking-wider bg-[#007BFF] text-white"
            >
              Get In Touch
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll label */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 text-xs tracking-widest sm:bottom-4">
        SCROLL
      </div>

      {/* Prefer modern dynamic viewport units when available */}
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
