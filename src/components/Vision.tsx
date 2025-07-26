import React from 'react'
import { Eye, Compass } from 'lucide-react'

const Vision: React.FC = () => {
  return (
    // Updated section background to match the dark theme
    <section id="vision" className="py-20 bg-[#100C0D] text-[#E3DCD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* Updated heading text color */}
          <h2 className="text-4xl font-bold text-[#E3DCD2] mb-4">Vision & Mission</h2>
          {/* Updated divider color to accent */}
          <div className="w-24 h-1 bg-[#CC8B65] mx-auto mb-8"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Vision Card */}
          {/* Updated card background, shadow, and border for dark theme */}
          <div className="bg-gradient-to-br from-[#013328] to-[#100C0D] p-8 rounded-2xl shadow-lg border border-[#CC8B65]/30">
            <div className="flex items-center mb-6">
              {/* Updated icon background and color */}
              <div className="bg-[#CC8B65]/20 w-16 h-16 rounded-full flex items-center justify-center mr-4">
                <Eye className="h-8 w-8 text-[#CC8B65]" />
              </div>
              {/* Updated heading text color */}
              <h3 className="text-2xl font-bold text-[#E3DCD2]">Vision</h3>
            </div>
            {/* Updated paragraph text color */}
            <p className="text-lg text-[#E3DCD2]/80 leading-relaxed">
              To elevate the business and urban landscape of Kurdistan by creating accessible, 
              ethical, and future-ready solutions.
            </p>
          </div>

          {/* Mission Card */}
          {/* Updated card background, shadow, and border for dark theme */}
          <div className="bg-gradient-to-br from-[#013328] to-[#CC8B65] p-8 rounded-2xl shadow-lg border border-[#CC8B65]/30">
            <div className="flex items-center mb-6">
              {/* Updated icon background and color */}
              <div className="bg-[#CC8B65]/20 w-16 h-16 rounded-full flex items-center justify-center mr-4">
                <Compass className="h-8 w-8 text-[#CC8B65]" />
              </div>
              {/* Updated heading text color */}
              <h3 className="text-2xl font-bold text-[#E3DCD2]">Mission</h3>
            </div>
            {/* Updated paragraph text color */}
            <p className="text-lg text-[#E3DCD2]/80 leading-relaxed">
              To build and support ventures that solve real-world problems through innovation, 
              collaboration, and strategic growth—while maintaining integrity, transparency, 
              and social responsibility.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mt-16">
          {/* Updated heading text color */}
          <h3 className="text-2xl font-bold text-center text-[#E3DCD2] mb-12">Core Values</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: "Innovation", color: "blue" }, // These colors will be overridden
              { title: "Integrity", color: "emerald" },
              { title: "Sustainability", color: "green" },
              { title: "Excellence", color: "amber" }
            ].map((value, index) => (
              <div key={index} className="text-center">
                {/* Updated icon container background and inner circle background */}
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-[#013328] flex items-center justify-center`}>
                  <div className={`w-12 h-12 rounded-full bg-[#CC8B65]`}></div>
                </div>
                {/* Updated title text color */}
                <h4 className="text-lg font-semibold text-[#E3DCD2]">{value.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Vision
