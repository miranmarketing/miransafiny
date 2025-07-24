import React from 'react'
import { BarChart3, Building2, Zap, TrendingUp, Users, Megaphone, Globe } from 'lucide-react'

const Skills: React.FC = () => {
  const skills = [
    {
      icon: BarChart3,
      title: "Brand Strategy & Storytelling",
      level: 95
    },
    {
      icon: Building2,
      title: "Real Estate Development",
      level: 90
    },
    {
      icon: Zap,
      title: "Green Tech & Solar Infrastructure",
      level: 85
    },
    {
      icon: TrendingUp,
      title: "Business Development",
      level: 92
    },
    {
      icon: Users,
      title: "Team Leadership & Operations",
      level: 88
    },
    {
      icon: Megaphone,
      title: "Marketing (Digital, Traditional & Experiential)",
      level: 94
    },
    {
      icon: Globe,
      title: "Market Entry Advisory (Kurdistan / Iraq)",
      level: 96
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Skills & Expertise</h2>
          <div className="w-24 h-1 bg-emerald-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A comprehensive skill set built through years of hands-on experience 
            across multiple industries and markets.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {skills.map((skill, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                  <skill.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{skill.title}</h3>
                </div>
                <div className="text-sm font-medium text-emerald-600">{skill.level}%</div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Professional Focus Areas</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Strategic Planning",
              "Market Analysis", 
              "Digital Transformation",
              "Sustainable Business",
              "Cross-Cultural Communication",
              "Project Management",
              "Investment Advisory",
              "Partnership Development"
            ].map((area, index) => (
              <span key={index} className="px-6 py-3 bg-white border border-emerald-200 text-emerald-700 rounded-full text-sm font-medium hover:bg-emerald-50 transition-colors duration-300">
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills