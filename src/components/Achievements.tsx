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
    // Updated section background to match the dark theme
    <section id="achievements" className="py-20 bg-[#100C0D] text-[#E3DCD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Updated heading text color */}
          <h2 className="text-4xl font-bold text-[#E3DCD2] mb-4">Key Achievements</h2>
          {/* Updated divider color to accent */}
          <div className="w-24 h-1 mx-auto mb-6 bg-[#CC8B65]"></div>
          {/* Updated paragraph text color */}
          <p className="text-lg text-[#E3DCD2]/80 max-w-2xl mx-auto">
            A track record of innovation, leadership, and impactful results across multiple industries
          </p>
        </div>

        {/* Achievement Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              // Updated card background, border, and shadow for dark theme
              className="group bg-[#013328] p-6 rounded-xl border border-[#CC8B65]/30 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div
                // Updated icon background color
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 bg-[#CC8B65]"
              >
                {/* Updated icon color */}
                <achievement.icon className="h-8 w-8 text-[#100C0D]" />
              </div>
              {/* Updated title and description text colors */}
              <h3 className="text-xl font-semibold text-[#E3DCD2] mb-3">{achievement.title}</h3>
              <p className="text-[#E3DCD2]/80 text-sm leading-relaxed">{achievement.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div
          className="mt-20 rounded-2xl p-8 text-[#E3DCD2]"
          // Updated gradient background for stats section
          style={{ background: 'linear-gradient(to right, #013328, #CC8B65)' }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10+", label: "Years Experience" },
              { value: "50+", label: "Projects Completed" },
              { value: "1000+", label: "Happy Clients" },
              { value: "3", label: "Industries" }
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                {/* Updated label text color */}
                <div className="text-[#E3DCD2]/70 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Achievements
