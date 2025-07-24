import React from 'react'
import { Heart, Leaf, Smartphone, Globe } from 'lucide-react'

const Philosophy: React.FC = () => {
  const principles = [
    {
      icon: Heart,
      title: "Customer-centric thinking",
      description: "Understand deeply, serve ethically",
      color: "rose"
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Every project should reduce harm and increase long-term benefits",
      color: "emerald"
    },
    {
      icon: Smartphone,
      title: "Digital-forward",
      description: "Embrace technology to accelerate and innovate",
      color: "blue"
    },
    {
      icon: Globe,
      title: "Local roots, global mindset",
      description: "Empower the local economy with international standards and vision",
      color: "amber"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Business Philosophy</h2>
          <div className="w-24 h-1 bg-emerald-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Miran believes that businesses must lead with value—not just profit. 
            His approach emphasizes sustainable growth, ethical practices, and meaningful impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {principles.map((principle, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className={`bg-${principle.color}-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0`}>
                  <principle.icon className={`h-8 w-8 text-${principle.color}-600`} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{principle.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{principle.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quote Section */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg text-center">
          <blockquote className="text-2xl md:text-3xl font-light text-gray-700 italic mb-6">
            "Success is not just about profit—it's about creating lasting value 
            that benefits the community, the environment, and future generations."
          </blockquote>
          <cite className="text-lg font-semibold text-emerald-600">— Miran Safiny</cite>
        </div>
      </div>
    </section>
  )
}

export default Philosophy