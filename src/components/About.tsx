import React, { useEffect, useRef } from 'react'
import { Target, Lightbulb, Users, Award } from 'lucide-react'

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null)

  // Scroll-reveal: fade + slide from left (staggered)
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

  const highlights = [
    {
      icon: Target,
      title: 'Visionary Leadership',
      description: 'Sharp eye for emerging trends and reputation for execution',
    },
    {
      icon: Lightbulb,
      title: 'Innovation Focus',
      description: 'Pioneering initiatives with global standards for local markets',
    },
    {
      icon: Users,
      title: 'Value Creation',
      description: 'Always rooted in customer trust and long-term impact',
    },
    {
      icon: Award,
      title: 'Multi-Sector Experience',
      description:
        'Successful ventures across real estate, marketing, and renewable energy',
    },
  ]

  return (
    <section ref={sectionRef} id="about" className="py-16 sm:py-20 bg-white text-black">
      {/* Local styles for reveal animation */}
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
        {/* Heading */}
        <h2
          data-reveal
          style={{ ['--delay' as any]: '0ms' }}
          className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 sm:mb-10"
        >
          ABOUT MIRAN
        </h2>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          {/* Copy */}
          <div>
            <p
              data-reveal
              style={{ ['--delay' as any]: '120ms' }}
              className="text-base sm:text-lg mb-5 sm:mb-6 leading-relaxed"
            >
              Miran Safiny is a visionary entrepreneur and business leader based in Erbil,
              Kurdistan Region, Iraq. With a sharp eye for emerging trends and a reputation
              for execution, Miran has built and managed multiple successful ventures across
              real estate, marketing, and renewable energy sectors.
            </p>

            <p
              data-reveal
              style={{ ['--delay' as any]: '220ms' }}
              className="text-base sm:text-lg mb-7 sm:mb-8 leading-relaxed"
            >
              Driven by a belief in sustainable development, customer trust, and regional
              transformation, Miran continues to pioneer initiatives that bring global
              business standards to local markets. Whether leading creative campaigns or
              launching infrastructure projects, his work is always rooted in value creation
              and long-term impact.
            </p>

            <div
              data-reveal
              style={{ ['--delay' as any]: '320ms' }}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              <span className="px-3.5 sm:px-4 py-2 bg-black text-white text-xs sm:text-sm font-bold">
                Entrepreneur
              </span>
              <span className="px-3.5 sm:px-4 py-2 bg-[#007BFF] text-white text-xs sm:text-sm font-bold">
                Marketing Strategist
              </span>
              <span className="px-3.5 sm:px-4 py-2 bg-black text-white text-xs sm:text-sm font-bold">
                Real Estate Leader
              </span>
              <span className="px-3.5 sm:px-4 py-2 bg-black text-white text-xs sm:text-sm font-bold">
                Green Tech Advocate
              </span>
            </div>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {highlights.map((item, i) => (
              <div
                key={item.title}
                data-reveal
                style={{ ['--delay' as any]: `${150 + i * 120}ms` }}
                className="bg-zinc-100 p-5 sm:p-6 border border-black/10"
              >
                <div className="bg-black w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center mb-3.5 sm:mb-4">
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-black mb-1.5 sm:mb-2">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-[0.95rem] opacity-80 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
