import React from 'react'
import { Building, Zap, TrendingUp } from 'lucide-react'

const Biography: React.FC = () => {
  const ventures = [
    {
      icon: Building,
      name: "Miran Real Estate",
      description: "A trusted name in property marketing and sales in Erbil",
      color: "blue"
    },
    {
      icon: Zap,
      name: "Voltainer",
      description: "Innovative solar-powered container rental business providing clean energy for remote and off-grid uses",
      color: "emerald"
    },
    {
      icon: TrendingUp,
      name: "Business Consulting",
      description: "Helping companies refine their presence in Kurdish and Iraqi markets",
      color: "amber"
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Biography</h2>
          <div className="w-24 h-1 bg-emerald-600 mx-auto mb-8"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-12">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Born and raised in Erbil, Miran Safiny was inspired early on by the region's potential 
              and the entrepreneurial spirit of its people. He began his career in marketing, where 
              he quickly gained recognition for creative strategy and execution.
            </p>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Over the years, he expanded into real estate development and business consulting, 
              helping dozens of companies refine their presence in the Kurdish and Iraqi markets. 
              His work has touched multiple industries, always with a commitment to quality, 
              efficiency, and long-term thinking.
            </p>
          </div>

          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Key Ventures</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {ventures.map((venture, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className={`bg-${venture.color}-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto`}>
                    <venture.icon className={`h-8 w-8 text-${venture.color}-600`} />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">{venture.name}</h4>
                  <p className="text-gray-600 text-center leading-relaxed">{venture.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Biography