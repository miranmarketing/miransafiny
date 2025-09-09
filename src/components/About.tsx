import React from 'react'
import { Target, Lightbulb, Users, Award } from 'lucide-react'

const About: React.FC = () => {
  const highlights = [
    {
      icon: Target,
      title: "Visionary Leadership",
      description: "Sharp eye for emerging trends and reputation for execution"
    },
    {
      icon: Lightbulb,
      title: "Innovation Focus",
      description: "Pioneering initiatives with global standards for local markets"
    },
    {
      icon: Users,
      title: "Value Creation",
      description: "Always rooted in customer trust and long-term impact"
    },
    {
      icon: Award,
      title: "Multi-Sector Experience",
      description: "Successful ventures across real estate, marketing, and renewable energy"
    }
  ]

  return (
    // Updated section background to match the dark theme
    <section id="about" className="py-20 bg-[#100C0D] text-[#E3DCD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* Updated heading text color */}
          <h2 className="text-4xl font-bold text-[#E3DCD2] mb-4">About Miran</h2>
          {/* Updated divider color to accent */}
          <div className="w-24 h-1 bg-[#CC8B65] mx-auto mb-8"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {/* Updated paragraph text colors */}
            <p className="text-lg text-[#E3DCD2] mb-6 leading-relaxed">
              Miran Safiny is a visionary entrepreneur and business leader based in Erbil, Kurdistan Region, Iraq. 
              With a sharp eye for emerging trends and a reputation for execution, Miran has built and managed 
              multiple successful ventures across real estate, marketing, and renewable energy sectors.
            </p>
            
            <p className="text-lg text-[#E3DCD2] mb-8 leading-relaxed">
              Driven by a belief in sustainable development, customer trust, and regional transformation, 
              Miran continues to pioneer initiatives that bring global business standards to local markets. 
              Whether leading creative campaigns or launching infrastructure projects, his work is always 
              rooted in value creation and long-term impact.
            </p>

            <div className="flex flex-wrap gap-4">
              {/* Updated tag colors */}
              <span className="px-4 py-2 bg-[#E3DCD2]/10 text-[#E3DCD2] rounded-full text-sm font-medium">
                Entrepreneur
              </span>
              <span className="px-4 py-2 bg-[#CC8B65] text-[#100C0D] rounded-full text-sm font-medium">
                Marketing Strategist
              </span>
              <span className="px-4 py-2 bg-[#013328] text-[#E3DCD2] rounded-full text-sm font-medium">
                Real Estate Leader
              </span>
              <span className="px-4 py-2 bg-[#013328]/80 text-[#E3DCD2] rounded-full text-sm font-medium">
                Green Tech Advocate
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {highlights.map((item, index) => (
              <div 
                key={index} 
                // Updated highlight card background and border
                className="bg-[#013328] p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-[#CC8B65]/30"
              >
                {/* Updated icon background and color */}
                <div className="bg-[#CC8B65] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-[#100C0D]" />
                </div>
                {/* Updated highlight title and description text colors */}
                <h3 className="text-lg font-semibold text-[#E3DCD2] mb-2">{item.title}</h3>
                <p className="text-[#E3DCD2]/80 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
