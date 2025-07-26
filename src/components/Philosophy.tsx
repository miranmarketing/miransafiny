import React from 'react'
import { Heart, Leaf, Smartphone, Globe, TrendingUp } from 'lucide-react' // Added TrendingUp for new section

const Philosophy: React.FC = () => {
  const principles = [
    {
      icon: Heart,
      title: "Customer-centric thinking",
      description: "Understand deeply, serve ethically",
      color: "rose" // This will be overridden by the new palette
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Every project should reduce harm and increase long-term benefits",
      color: "emerald" // This will be overridden by the new palette
    },
    {
      icon: Smartphone,
      title: "Digital-forward",
      description: "Embrace technology to accelerate and innovate",
      color: "blue" // This will be overridden by the new palette
    },
    {
      icon: Globe,
      title: "Local roots, global mindset",
      description: "Empower the local economy with international standards and vision",
      color: "amber" // This will be overridden by the new palette
    }
  ]

  return (
    <section className="py-20 bg-[#100C0D] text-[#E3DCD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* Updated heading text color */}
          <h2 className="text-4xl font-bold text-[#E3DCD2] mb-4">Business Philosophy</h2>
          {/* Updated divider color to accent */}
          <div className="w-24 h-1 bg-[#CC8B65] mx-auto mb-8"></div>
          {/* Updated paragraph text color */}
          <p className="text-lg text-[#E3DCD2]/80 max-w-3xl mx-auto mb-4">
            Miran believes that businesses must lead with value—not just profit. 
            His approach emphasizes sustainable growth, ethical practices, and meaningful impact.
          </p>
          {/* Added a new paragraph to make it longer */}
          <p className="text-lg text-[#E3DCD2]/80 max-w-3xl mx-auto">
            This philosophy is deeply ingrained in every venture, from real estate development 
            to renewable energy solutions, ensuring that every step contributes positively to 
            the community and the broader economic landscape of Kurdistan.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {principles.map((principle, index) => (
            <div 
              key={index} 
              // Updated card background, shadow, and border for dark theme
              className="bg-[#013328] p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#CC8B65]/30"
            >
              <div className="flex items-start space-x-4">
                <div 
                  // Updated icon background color to accent
                  className={`bg-[#CC8B65]/20 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0`}
                >
                  {/* Updated icon color to accent */}
                  <principle.icon className={`h-8 w-8 text-[#CC8B65]`} />
                </div>
                <div>
                  {/* Updated title and description text colors */}
                  <h3 className="text-xl font-semibold text-[#E3DCD2] mb-3">{principle.title}</h3>
                  <p className="text-[#E3DCD2]/80 leading-relaxed">{principle.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Added new section for Future Vision */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#E3DCD2] mb-4">Future Vision</h2>
          <div className="w-24 h-1 bg-[#CC8B65] mx-auto mb-8"></div>
          <p className="text-lg text-[#E3DCD2]/80 max-w-3xl mx-auto">
            Looking ahead, Miran is committed to expanding his impact through strategic investments 
            in sustainable technologies and fostering a vibrant entrepreneurial ecosystem. 
            The goal is to empower local talent and drive innovation that resonates globally.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="bg-[#CC8B65] w-20 h-20 rounded-full flex items-center justify-center">
              <TrendingUp className="h-10 w-10 text-[#100C0D]" />
            </div>
          </div>
        </div>

        {/* Quote Section */}
        {/* Updated quote section background, shadow, and border */}
        <div className="bg-[#013328] p-8 md:p-12 rounded-2xl shadow-lg text-center border border-[#CC8B65]/30">
          {/* Updated quote text color */}
          <blockquote className="text-2xl md:text-3xl font-light text-[#E3DCD2]/80 italic mb-6">
            "Success is not just about profit—it's about creating lasting value 
            that benefits the community, the environment, and future generations."
          </blockquote>
          {/* Updated cite text color to accent */}
          <cite className="text-lg font-semibold text-[#CC8B65]">— Miran Safiny</cite>
        </div>
      </div>
    </section>
  )
}

export default Philosophy
