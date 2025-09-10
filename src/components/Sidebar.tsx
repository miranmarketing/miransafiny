import React, { useEffect, useMemo, useState } from 'react'
import { Linkedin, Instagram, Globe, Search } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const ACCENT = '#007BFF'

type NavItem = { label: string; href: `#${string}` }

const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems: NavItem[] = useMemo(
    () => [
      { label: 'HOME',         href: '#home' },
      { label: 'ARTICLES',     href: '#articles' },
      { label: 'ABOUT',        href: '#about' },
      { label: 'MY STORY',     href: '#story' },
      { label: 'ACHIEVEMENTS', href: '#achievements' },
      { label: 'CONTACT',      href: '#contact' },
    ],
    []
  )

  const [active, setActive] = useState<string>('#home')
  const [mobileOpen, setMobileOpen] = useState(false)

  /** Scroll-spy — active section by visibility */
  useEffect(() => {
    if (location.pathname !== '/') return
    const targets = navItems
      .map(n => document.querySelector(n.href))
      .filter((el): el is Element => !!el)

    if (!targets.length) return
    const io = new IntersectionObserver(
      (entries) => {
        let best: { id: string; ratio: number } | null = null
        for (const e of entries) {
          const id = `#${(e.target as HTMLElement).id}`
          const ratio = e.intersectionRatio
          if (ratio >= 0.25 && (!best || ratio > best.ratio)) best = { id, ratio }
        }
        if (best && best.id !== active) {
          setActive(best.id)
          try { window.history.replaceState(null, '', best.id) } catch {}
        }
      },
      { threshold: [0.25, 0.5, 0.75, 1], rootMargin: '-20% 0px -40% 0px' }
    )

    targets.forEach(s => io.observe(s))
    return () => io.disconnect()
    // do not include `active` to avoid re-initializing IO
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, navItems])

  /** If page loads on a hash, reflect it immediately */
  useEffect(() => {
    if (location.pathname !== '/') return
    const h = location.hash || '#home'
    const el = document.querySelector(h)
    if (el) setActive(h)
  }, [location.pathname, location.hash])

  /** Lock body scroll when mobile menu is open */
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [mobileOpen])

  const scrollTo = (hash: string) => {
    if (location.pathname === '/') {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActive(hash)
      setMobileOpen(false)
    } else {
      navigate('/', { state: { scrollTo: hash } })
      setMobileOpen(false)
    }
  }

  const handleSearchClick = () => {
    const existing = document.getElementById('search-overlay')
    if (existing) { existing.remove(); return }

    const overlay = document.createElement('div')
    overlay.id = 'search-overlay'
    overlay.className =
      'fixed inset-0 bg-black/80 z-[70] flex flex-col items-center justify-center p-8 transition-opacity duration-300 opacity-0'
    overlay.innerHTML = `
      <div class="relative w-full max-w-xl">
        <input id="search-input" type="text"
          class="w-full bg-transparent text-white border-b-2 border-white px-0 py-3 text-4xl placeholder-white/50 focus:outline-none"
          placeholder="SEARCH" />
        <button class="absolute top-1/2 right-0 -translate-y-1/2 text-white/70 hover:text-white"
          onclick="document.getElementById('search-overlay').remove()">✕</button>
      </div>
      <p class="text-white/50 text-xs mt-4">Hit enter to search or ESC to close</p>
    `
    document.body.appendChild(overlay)
    setTimeout(() => {
      overlay.classList.remove('opacity-0')
      const input = document.getElementById('search-input') as HTMLInputElement | null
      if (input) {
        input.focus()
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            navigate(`/articles?search=${encodeURIComponent(input.value)}`)
            overlay.remove()
          }
          if (e.key === 'Escape') overlay.remove()
        })
      }
    }, 10)
  }

  return (
    <>
      {/* ===== Desktop Sidebar (md+) ===== */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-black text-white flex-col z-50">
        {/* Brand SVG */}
        <div className="w-11/12 mx-auto mt-8 mb-2">
          <img
            src="/safiny.svg"
            alt="Miran Safiny"
            className="block w-[72%] mx-auto select-none"
            decoding="async"
            loading="eager"
            draggable="false"
          />
        </div>

        {/* Nav — blue wipe, square corners */}
        <nav className="px-5 space-y-1 flex-1 flex flex-col items-stretch justify-center">
          {navItems.map((item) => {
            const isActive = active === item.href
            return (
              <div key={item.label} className="group relative w-full overflow-hidden">
                <span
                  className={[
                    'absolute inset-0 transform origin-left transition-transform duration-300',
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  ].join(' ')}
                  style={{ backgroundColor: ACCENT }}
                />
                <button
                  onClick={() => scrollTo(item.href)}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'relative z-10 block w-full text-left py-2 px-3',
                    'text-[15px] font-bold tracking-[0.18em]',
                    'text-white'
                  ].join(' ')}
                >
                  {item.label}
                </button>
              </div>
            )
          })}
        </nav>

        {/* Social / actions */}
        <div className="px-5 pb-6 flex items-center gap-3 border-t border-white/10 pt-4">
          <button onClick={handleSearchClick} className="hover:opacity-80" aria-label="Search">
            <Search className="w-5 h-5" />
          </button>
          <a className="hover:opacity-80" href="https://www.linkedin.com/in/miran-safiny-48b375229/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <Linkedin className="w-5 h-5" />
          </a>
          <a className="hover:opacity-80" href="https://instagram.com/miransafiny" target="_blank" rel="noreferrer" aria-label="Instagram">
            <Instagram className="w-5 h-5" />
          </a>
          <a className="hover:opacity-80" href="https://miransafiny.com" target="_blank" rel="noreferrer" aria-label="Website">
            <Globe className="w-5 h-5" />
          </a>
        </div>
      </aside>

      {/* ===== Mobile Top Bar (<md) ===== */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-black/95 backdrop-blur z-50 border-b border-white/10 flex items-center justify-between px-4">
        <img
          src="/safiny.svg"
          alt="Miran Safiny"
          className="h-7 w-100vw select-none"
          loading="eager"
          decoding="async"
          draggable="false"
        />
        <div className="flex items-center gap-3">
          <button onClick={handleSearchClick} aria-label="Search" className="text-white/90">
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="text-white/90"
          >
            {/* Hamburger */}
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect y="0" width="22" height="2" fill="currentColor"/>
              <rect y="7" width="22" height="2" fill="currentColor"/>
              <rect y="14" width="22" height="2" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </header>

      {/* ===== Mobile Full-screen Menu ===== */}
      <div
        className={[
          'md:hidden fixed inset-0 z-[60] bg-black transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        ].join(' ')}
        role="dialog"
        aria-modal="true"
      >
        {/* Top row: close */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
          <img src="/safiny.svg" alt="Miran Safiny" className="h-7 w-auto" />
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="text-white/90"
          >
            ✕
          </button>
        </div>

        {/* Menu items */}
        <div className="px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = active === item.href
            return (
              <div key={item.label} className="group relative w-full overflow-hidden">
                <span
                  className={[
                    'absolute inset-0 transform origin-left transition-transform duration-300',
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  ].join(' ')}
                  style={{ backgroundColor: ACCENT }}
                />
                <button
                  onClick={() => scrollTo(item.href)}
                  aria-current={isActive ? 'page' : undefined}
                  className="relative z-10 w-full text-left py-3 px-3 text-[17px] font-extrabold tracking-[0.18em] text-white"
                >
                  {item.label}
                </button>
              </div>
            )
          })}
        </div>

        {/* Social row */}
        <div className="mt-auto px-4 pb-6 border-t border-white/10 pt-4 flex items-center gap-4">
          <a className="hover:opacity-80" href="https://www.linkedin.com/in/miran-safiny-48b375229/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <Linkedin className="w-5 h-5" />
          </a>
          <a className="hover:opacity-80" href="https://instagram.com/miransafiny" target="_blank" rel="noreferrer" aria-label="Instagram">
            <Instagram className="w-5 h-5" />
          </a>
          <a className="hover:opacity-80" href="https://miransafiny.com" target="_blank" rel="noreferrer" aria-label="Website">
            <Globe className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Spacer so content isn't under mobile bar */}
      <div className="md:hidden h-14" />
    </>
  )
}

export default Sidebar
