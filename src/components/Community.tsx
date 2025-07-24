import React from 'react'
import { Users, Zap, Home, TreePine } from 'lucide-react'

const Community: React.FC = () => {
  const initiatives = [
    {
      icon: Users,
      title: "Youth Entrepreneurship",
      description: "Supporting the next generation of business leaders"
    },
    {
      icon: Zap,
      title: "Renewable Energy Awareness",
      description: "Promoting clean energy solutions in Kurdistan"
    },
    {
      icon: Home,
      title: "Affordable Housing",
      description: "Making quality housing accessible to more families"
    },
    {
      icon: TreePine,
      title: "Urban Sustainability",
      description: "Building a more livable future for Kurdistan"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Community & Social Engagement</h2>
          <div className="w-24 h-1 bg-emerald-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Beyond business, Miran actively supports initiatives that strengthen communities 
            and create positive social impact throughout Kurdistan.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {initiatives.map((initiative, index) => (
            <div key={index} className="text-center group">
              <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-200 transition-colors duration-300">
                <initiative.icon className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{initiative.title}</h3>
              <p className="text-gray-600">{initiative.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-8 rounded-2xl">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Making a Difference</h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Miran actively collaborates with local organizations, startups, and municipalities 
              to contribute to a more dynamic and livable future. His commitment extends beyond 
              business success to meaningful community impact and sustainable development.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Community