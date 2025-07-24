import React from 'react'
import { Eye, Compass } from 'lucide-react'

const Vision: React.FC = () => {
  return (
    <section id="vision" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Vision & Mission</h2>
          <div className="w-24 h-1 bg-emerald-600 mx-auto mb-8"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Vision */}
          <div className="bg-gradient-to-br from-blue-50 to-emerald-50 p-8 rounded-2xl shadow-lg">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mr-4">
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Vision</h3>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              To elevate the business and urban landscape of Kurdistan by creating accessible, 
              ethical, and future-ready solutions.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-gradient-to-br from-emerald-50 to-amber-50 p-8 rounded-2xl shadow-lg">
            <div className="flex items-center mb-6">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mr-4">
                <Compass className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Mission</h3>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              To build and support ventures that solve real-world problems through innovation, 
              collaboration, and strategic growth—while maintaining integrity, transparency, 
              and social responsibility.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">Core Values</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: "Innovation", color: "blue" },
              { title: "Integrity", color: "emerald" },
              { title: "Sustainability", color: "green" },
              { title: "Excellence", color: "amber" }
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-${value.color}-100 flex items-center justify-center`}>
                  <div className={`w-12 h-12 rounded-full bg-${value.color}-600`}></div>
                </div>
                <h4 className="text-lg font-semibold text-gray-900">{value.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Vision