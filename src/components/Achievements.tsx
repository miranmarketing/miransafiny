import React from 'react'
import { Award, TrendingUp, Users, Globe, Lightbulb } from 'lucide-react'

const Achievements: React.FC = () => {
  const achievements = [
    {
      icon: Lightbulb,
      title: "Launched Voltainer",
      description: "The region's first green, mobile energy container unit business",
      color: "emerald"
    },
    {
      icon: Award,
      title: "Established Miran Real Estate",
      description: "As a top-tier brand for residential and commercial property solutions in Erbil",
      color: "blue"
    },
    {
      icon: TrendingUp,
      title: "Successful Marketing Campaigns",
      description: "Spearheaded multiple campaigns across digital, TV, and out-of-home channels",
      color: "purple"
    },
    {
      icon: Globe,
      title: "International Market Entry",
      description: "Helped secure investment and market entry for international clients into Kurdistan's property market",
      color: "amber"
    },
    {
      icon: Users,
      title: "Strong Professional Network",
      description: "Built a loyal customer base and network across Iraq, UAE, and beyond",
      color: "rose"
    }
  ]

  return (
    <section id="achievements" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Achievements</h2>
          <div className="w-24 h-1 bg-emerald-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A track record of innovation, leadership, and impactful results across multiple industries
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <div key={index} className="group bg-gray-50 hover:bg-white p-6 rounded-xl border border-gray-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
              <div className={`bg-${achievement.color}-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <achievement.icon className={`h-8 w-8 text-${achievement.color}-600`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{achievement.title}</h3>
              <p className="text-gray-600 leading-relaxed">{achievement.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">10+</div>
              <div className="text-blue-100">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Projects Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100+</div>
              <div className="text-blue-100">Happy Clients</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">3</div>
              <div className="text-blue-100">Industries</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Achievements