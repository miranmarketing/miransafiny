import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const Achievements: React.FC = () => {
  const { t } = useTranslation()
  const achievements = useMemo(() => {
    return t('achievements.items', { returnObjects: true }) as { title: string; description: string }[]
  }, [t])

  return (
    <section id="achievements" className="py-20 bg-black text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black">{t('achievements.heading')}</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <div key={index} className="group bg-[#040404] p-6 border border-white/10">
              <h3 className="text-lg font-black mb-2">{achievement.title}</h3>
              <p className="text-sm opacity-80 leading-relaxed">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Achievements
