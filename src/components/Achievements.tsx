import React from 'react'
import { Award, TrendingUp, Users, Globe, Lightbulb } from 'lucide-react'

const Achievements: React.FC = () => {
  const achievements = [
    {
      icon: Lightbulb,
      title: "Launched Zillion Max",
      description: "Offering Business consultancy and Developing Kurdistan's Infrastructure",
      // Original color, will be overridden by dark theme
      color: "#1A5276" 
    },
    {
      icon: Award,
      title: "Established Miran Real Estate",
      description: "As a top-tier brand for residential and commercial property solutions in Erbil",
      // Original color, will be overridden by dark theme
      color: "#2980B9"
    },
    {
      icon: TrendingUp,
      title: "Successful Marketing Campaigns",
      description: "Spearheaded multiple campaigns across digital, TV, and out-of-home channels",
      // Original color, will be overridden by dark theme
      color: "#85C1E9"
    },
    {
      icon: Globe,
      title: "International Market Entry",
      description: "Helped secure investment and market entry for international clients into Kurdistan's property market",
      // Original color, will be overridden by dark theme
      color: "#F7DC6F"
    },
    {
      icon: Users,
      title: "Strong Professional Network",
      description: "Built a loyal customer base and network across Iraq, UAE, and beyond",
      // Original color, will be overridden by dark theme
      color: "#D4AC0D"
    }
  ]

  return (
    <section id="achievements" className="py-20 bg-black text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black">KEY ACCOMPLISHMENTS</h2>
        </div>

        {/* Achievement Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="group bg-[#040404] p-6 border border-white/10"
            >
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
