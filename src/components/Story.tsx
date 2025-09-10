import React, { useRef, useEffect, useState, useCallback } from 'react'

/** === CONFIG === */
const ACCENT = '#007BFF' // Miran blue
const MAX_TILT_DEG = 4   // 3D hover tilt

type TimelineItem = {
  year: string
  title?: string
  text: string
  img: string
  alt?: string
}

const timeline: TimelineItem[] = [
  { year: '2004', title: 'Getting Started', text: 'At a young age, Miran starts helping in family business.', img: '/1992.jpg', alt: 'Young Miran' },
  { year: '2014', title: 'Early Marketing', text: 'Started working in a Real Estate Firm and gained trust of more than thousands of clients.', img: '/2014.jpg', alt: 'Marketing in Erbil' },
  { year: '2021', title: 'Scaling Ventures', text: 'Founded  Miran Real Estate with the vision of revolutionizing the industry', img: '/2021.jpeg', alt: 'Scaling ventures' },
  { year: '2024', title: 'Founding Push', text: 'Expanded across marketing and real estate with key partnerships.', img: '/2024.JPG', alt: 'Founding ventures' }
]

/** === HELPERS === */
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

const Story: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const railRef = useRef<HTMLDivElement | null>(null)

  const [atBound, setAtBound] = useState<'start' | 'middle' | 'end'>('start')

  /** Track start/middle/end of the rail */
  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    const onScroll = () => {
      const max = rail.scrollWidth - rail.clientWidth
      if (max <= 5) { setAtBound('start'); return }
      if (rail.scrollLeft <= 5) setAtBound('start')
      else if (rail.scrollLeft >= max - 5) setAtBound('end')
      else setAtBound('middle')
    }
    onScroll()
    rail.addEventListener('scroll', onScroll, { passive: true })
    return () => rail.removeEventListener('scroll', onScroll)
  }, [])

  /** Drag-to-scroll with inertia (touch + mouse), vertical scroll allowed when not dragging */
  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    // config
    const DRAG_THRESHOLD = 6 // px before we "lock in" dragging
    const DECAY = 0.95
    const VELOCITY_MULT = 18

    // state (refs to avoid re-renders)
    let isPointerDown = false
    let dragging = false
    let startX = 0
    let startY = 0
    let startScrollLeft = 0
    let lastX = 0
    let lastT = 0
    let vx = 0
    let raf: number | null = null

    const stopInertia = () => { if (raf) { cancelAnimationFrame(raf); raf = null } }

    const setSnap = (enabled: boolean) => {
      // temporarily disable snap while dragging so it won't fight the gesture
      rail.style.scrollSnapType = enabled ? 'x mandatory' : 'none'
    }

    const onPointerDown = (e: PointerEvent) => {
      isPointerDown = true
      dragging = false
      rail.setPointerCapture(e.pointerId)
      startX = e.clientX
      startY = e.clientY
      startScrollLeft = rail.scrollLeft
      lastX = e.clientX
      lastT = performance.now()
      vx = 0
      stopInertia()
      rail.style.cursor = 'grabbing'
      rail.classList.add('is-dragging') // disable selection
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDown) return

      const dx = e.clientX - startX
      const dy = e.clientY - startY

      // If not yet dragging, decide based on movement direction/threshold.
      if (!dragging) {
        if (Math.abs(dx) > DRAG_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
          dragging = true
          setSnap(false)
        } else {
          // let the page scroll vertically if it’s mostly Y
          return
        }
      }

      // we are dragging horizontally: prevent native scroll
      e.preventDefault()
      rail.scrollLeft = startScrollLeft - dx

      // velocity estimate for inertia
      const now = performance.now()
      const dt = now - lastT
      if (dt > 0) {
        vx = (e.clientX - lastX) / dt // px/ms
        lastX = e.clientX
        lastT = now
      }
    }

    const endDrag = (e: PointerEvent) => {
      if (!isPointerDown) return
      isPointerDown = false
      rail.releasePointerCapture(e.pointerId)
      rail.style.cursor = ''
      rail.classList.remove('is-dragging')

      // inertia only if we actually dragged
      if (dragging) {
        dragging = false
        let velocity = -vx * VELOCITY_MULT
        const step = () => {
          if (Math.abs(velocity) < 0.2) { raf = null; setSnap(true); return }
          rail.scrollLeft += velocity
          velocity *= DECAY
          raf = requestAnimationFrame(step)
        }
        step()
      } else {
        setSnap(true)
      }
    }

    rail.addEventListener('pointerdown', onPointerDown, { passive: true })
    rail.addEventListener('pointermove', onPointerMove) // must be non-passive to allow preventDefault
    rail.addEventListener('pointerup', endDrag)
    rail.addEventListener('pointercancel', endDrag)
    rail.addEventListener('pointerleave', (e) => { if (isPointerDown) endDrag(e as any) })

    return () => {
      rail.removeEventListener('pointerdown', onPointerDown as any)
      rail.removeEventListener('pointermove', onPointerMove as any)
      rail.removeEventListener('pointerup', endDrag as any)
      rail.removeEventListener('pointercancel', endDrag as any)
      rail.removeEventListener('pointerleave', endDrag as any)
      stopInertia()
    }
  }, [])

  /** Reveal animation — attach AFTER rail exists */
  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    const cards = rail.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!cards.length) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { root: rail, threshold: 0.2 }
    )

    cards.forEach((el) => io.observe(el))

    const safety = setTimeout(() => {
      cards.forEach((el) => el.classList.add('is-visible'))
    }, 1600)

    return () => { io.disconnect(); clearTimeout(safety) }
  }, [])

  /** 3D tilt handlers (hover) */
  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width * 2 - 1
    const py = (e.clientY - rect.top) / rect.height * 2 - 1
    const rotY = clamp(-px * MAX_TILT_DEG, -MAX_TILT_DEG, MAX_TILT_DEG)
    const rotX = clamp(py * MAX_TILT_DEG, -MAX_TILT_DEG, MAX_TILT_DEG)
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`
  }, [])
  const handleEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transition = 'transform 360ms cubic-bezier(0.22,1,0.36,1)'
  }, [])
  const handleLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    card.style.transition = 'transform 520ms cubic-bezier(0.22,1,0.36,1)'
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
  }, [])

  /** Jump one card using side buttons (gap-aware) */
  const jump = (dir: 'prev' | 'next') => {
    const rail = railRef.current
    if (!rail) return
    const first = rail.querySelector('[data-card]') as HTMLElement | null
    const gapStr = getComputedStyle(rail).gap || '0'
    const gap = parseFloat(gapStr) || 0
    const cardWidth = first ? first.offsetWidth + gap : Math.round(rail.clientWidth * 0.8)
    rail.scrollBy({ left: dir === 'next' ? cardWidth : -cardWidth, behavior: 'smooth' })
  }

  return (
    <section ref={sectionRef} id="story" className="relative bg-[#040404] text-white py-16 md:py-24">
      <div className="max-w-[120rem] mx-auto px-4 md:px-10">
        {/* Header */}
        <div className="relative inline-block mb-8 md:mb-12" style={{ animation: 'headerIn 700ms cubic-bezier(0.22,1,0.36,1) both' }}>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight">MY STORY</h2>
          <span className="absolute left-0 -bottom-1 h-[0.375rem] w-0 bg-[var(--accent)] animate-[wipe_900ms_ease-out_forwards]" />
        </div>

        {/* Rail */}
        <div
          ref={railRef}
          role="list"
          className={[
            'relative w-full overflow-x-auto overflow-y-visible',
            'scroll-smooth snap-x snap-mandatory',
            'flex gap-4 sm:gap-6 md:gap-8',
            'pl-[4vw] pr-[4vw] sm:pl-[6vw] sm:pr-[6vw]',
            '[&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0',
            'select-none'
          ].join(' ')}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            cursor: 'grab',
            touchAction: 'pan-y',             // allow vertical scroll when not dragging
            overscrollBehaviorX: 'contain'    // no bounce to parent horizontally
          }}
        >
          {timeline.map((item, idx) => (
            <article
              key={`${item.year}-${idx}`}
              data-card
              className={[
                'group',
                'snap-start shrink-0',
                // slightly wider on very small screens; tighter at md+
                'min-w-[88vw] xs:min-w-[84vw] sm:min-w-[68vw] md:min-w-[56vw] lg:min-w-[48vw] xl:min-w-[42vw]',
                'relative bg-white/[0.03] border border-white/10 overflow-hidden'
              ].join(' ')}
            >
              {/* OUTER: entrance from right + fade on rail visibility */}
              <div data-reveal className="reveal">
                {/* INNER: tilt wrapper */}
                <div
                  className="relative h-full w-full transition-transform duration-75 ease-linear will-change-transform"
                  onMouseMove={handleMove}
                  onMouseEnter={handleEnter}
                  onMouseLeave={handleLeave}
                  style={{ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' }}
                >
                  {/* Media: 4:3 */}
                  <figure className="w-full aspect-[4/3] relative" draggable={false}>
                    <img
                      src={item.img}
                      alt={item.alt || item.year}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      fetchPriority={idx === 0 ? 'high' : ('auto' as any)}
                      decoding="async"
                      draggable={false}
                      className={[
                        'absolute inset-0 h-full w-full object-cover object-center',
                        'filter grayscale saturate-0 transition-all duration-500',
                        'group-hover:grayscale-0 group-hover:saturate-100 group-hover:scale-[1.02]'
                      ].join(' ')}
                      style={{ willChange: 'transform, filter' }}
                    />
                    {/* Accents */}
                    <span className="absolute top-0 left-0 h-[2px] w-[12%]" style={{ backgroundColor: ACCENT }} />
                    <span className="absolute bottom-0 right-0 h-[2px] w-[12%]" style={{ backgroundColor: ACCENT }} />
                    {/* Readability gradient */}
                    <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/0 pointer-events-none" />
                  </figure>

                  {/* Overlay copy */}
                  <div className="absolute inset-0 flex flex-col justify-between p-[5vw] sm:p-[4vw] md:p-[3vw]">
                    <div className="flex items-center gap-[1rem]">
                      <div className="text-[11vw] sm:text-[6vw] md:text-[4.8vw] lg:text-[3.8vw] leading-none font-black drop-shadow-[0_0_.5rem_rgba(0,0,0,0.6)]">
                        {item.year}
                      </div>
                      <div className="h-[0.25rem] w-[18vw] md:w-[10vw]" style={{ backgroundColor: ACCENT }} />
                    </div>

                    <div className="max-w-[70ch]">
                      {item.title && (
                        <h3 className="text-[1.125rem] sm:text-[1.35rem] md:text-[1.6rem] font-extrabold tracking-tight mb-[0.5rem]">
                          {item.title}
                        </h3>
                      )}
                      <p className="text-[0.95rem] sm:text-[1rem] md:text-[1.0625rem] leading-[1.75] text-white/90">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* SIDE BUTTONS (pinned inside section) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-y-0 left-1 sm:left-3 md:left-5 flex items-center">
          <button
            onClick={() => jump('prev')}
            className={[
              'pointer-events-auto select-none',
              'h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14',
              'flex items-center justify-center',
              'bg-white/8 hover:bg-white/14 border border-white/15',
              'text-white text-lg sm:text-xl',
              'transition-colors duration-200'
            ].join(' ')}
            aria-label="Previous"
            disabled={atBound === 'start'}
            style={{ opacity: atBound === 'start' ? 0.5 : 1 }}
          >
            ←
          </button>
        </div>
        <div className="absolute inset-y-0 right-1 sm:right-3 md:right-5 flex items-center">
          <button
            onClick={() => jump('next')}
            className={[
              'pointer-events-auto select-none',
              'h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14',
              'flex items-center justify-center',
              'bg-white/8 hover:bg-white/14 border border-white/15',
              'text-white text-lg sm:text-xl',
              'transition-colors duration-200'
            ].join(' ')}
            aria-label="Next"
            disabled={atBound === 'end'}
            style={{ opacity: atBound === 'end' ? 0.5 : 1 }}
          >
            →
          </button>
        </div>
      </div>

      {/* Local styles */}
      <style>{`
        :root { --accent: ${ACCENT}; }
        @keyframes wipe { from { width: 0; } to { width: 100%; } }
        @keyframes headerIn { from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); } }

        /* Reveal animation */
        .reveal { opacity: 0; transform: translate3d(8%,0,0); transition: transform 520ms cubic-bezier(0.22,1,0.36,1), opacity 520ms cubic-bezier(0.22,1,0.36,1); }
        .reveal.is-visible { opacity: 1; transform: translate3d(0,0,0); }

        /* While dragging: avoid text selection cursor changes in descendants */
        .is-dragging, .is-dragging * { cursor: grabbing !important; user-select: none !important; }
      `}</style>
    </section>
  )
}

export default Story
