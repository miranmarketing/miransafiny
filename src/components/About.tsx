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
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">About Miran</h2>
          <div className="w-24 h-1 bg-emerald-600 mx-auto mb-8"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Miran Safiny is a visionary entrepreneur and business leader based in Erbil, Kurdistan Region, Iraq. 
              With a sharp eye for emerging trends and a reputation for execution, Miran has built and managed 
              multiple successful ventures across real estate, marketing, and renewable energy sectors.
            </p>
            
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Driven by a belief in sustainable development, customer trust, and regional transformation, 
              Miran continues to pioneer initiatives that bring global business standards to local markets. 
              Whether leading creative campaigns or launching infrastructure projects, his work is always 
              rooted in value creation and long-term impact.
            </p>

            <div className="flex flex-wrap gap-4">
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Entrepreneur
              </span>
              <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                Marketing Strategist
              </span>
              <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                Real Estate Leader
              </span>
              <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                Green Tech Advocate
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {highlights.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About