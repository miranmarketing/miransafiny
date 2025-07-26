import React from 'react'
import { Building, Zap, TrendingUp } from 'lucide-react'

const Biography: React.FC = () => {
  const ventures = [
    {
      icon: Building,
      name: "Miran Real Estate",
      description: "A trusted name in property marketing and sales in Erbil",
      color: "blue" // This color will be overridden by the new palette
    },
    {
      icon: Zap,
      name: "Zillion Max",
      description: "Innovative Business Solutions and Consultancy",
      color: "emerald" // This color will be overridden by the new palette
    },
    {
      icon: TrendingUp,
      name: "Business Consulting",
      description: "Helping companies refine their presence in Kurdish and Iraqi markets",
      color: "amber" // This color will be overridden by the new palette
    }
  ]

  return (
    // Updated section background to match the dark theme
    <section className="py-20 bg-[#100C0D] text-[#E3DCD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* Updated heading text color */}
          <h2 className="text-4xl font-bold text-[#E3DCD2] mb-4">Biography</h2>
          {/* Updated divider color to accent */}
          <div className="w-24 h-1 bg-[#CC8B65] mx-auto mb-8"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Updated biography card background, shadow, and border */}
          <div className="bg-[#013328] p-8 rounded-2xl shadow-xl mb-12 border border-[#CC8B65]/30">
            {/* Updated paragraph text colors */}
            <p className="text-lg text-[#E3DCD2]/80 mb-6 leading-relaxed">
              Born and raised in Erbil, Miran Safiny was inspired early on by the region's potential 
              and the entrepreneurial spirit of its people. He began his career in marketing, where 
              he quickly gained recognition for creative strategy and execution.
            </p>
            
            <p className="text-lg text-[#E3DCD2]/80 mb-6 leading-relaxed">
              Over the years, he expanded into real estate development and business consulting, 
              helping dozens of companies refine their presence in the Kurdish and Iraqi markets. 
              His work has touched multiple industries, always with a commitment to quality, 
              efficiency, and long-term thinking.
            </p>
          </div>

          <div className="mb-12">
            {/* Updated heading text color */}
            <h3 className="text-2xl font-bold text-[#E3DCD2] mb-8 text-center">Key Ventures</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {ventures.map((venture, index) => (
                <div 
                  key={index} 
                  // Updated venture card background, shadow, and border
                  className="bg-[#013328] p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#CC8B65]/30"
                >
                  <div 
                    // Updated icon background color to accent
                    className={`bg-[#CC8B65] w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto`}
                  >
                    {/* Updated icon color to dark text */}
                    <venture.icon className={`h-8 w-8 text-[#100C0D]`} />
                  </div>
                  {/* Updated venture name and description text colors */}
                  <h4 className="text-xl font-semibold text-[#E3DCD2] mb-4 text-center">{venture.name}</h4>
                  <p className="text-[#E3DCD2]/80 text-center leading-relaxed">{venture.description}</p>
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
