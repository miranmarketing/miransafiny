import React from 'react'
import { ArrowRight, MapPin, Linkedin, Instagram, Twitter } from 'lucide-react'

const Hero: React.FC = () => {
  const scrollToContact = () => {
    const element = document.querySelector('#contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#100C0D] text-[#E3DCD2]">
      {/* Background image with cutout shape */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-y-0 right-0 w-1/2 bg-no-repeat bg-cover bg-center"
          style={{
            backgroundImage: "url('/miran.png')", // Ensure this image is available at the specified path
            clipPath: 'polygon(0% 10%, 100% 0%, 100% 100%, 0% 100%)',
          }}
        />
        {/* Updated gradient overlay using the new palette */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#100C0D] via-[#013328] to-[#CC8B65] opacity-90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              {/* MapPin icon color updated */}
              <MapPin className="h-5 w-5 text-[#CC8B65] mr-2" />
              {/* Location text color updated */}
              <span className="text-[#CC8B65] font-medium">Erbil, Kurdistan Region, Iraq</span>
            </div>

            {/* Title text color updated */}
            <h1 className="text-5xl lg:text-6xl font-bold text-[#E3DCD2] mb-6 leading-tight">
              Miran Safiny
            </h1>

            {/* Subtitle text color updated */}
            <p className="text-xl lg:text-2xl text-[#E3DCD2] mb-8 font-light">
              Vision-Driven Entrepreneur | Marketing Strategist | Real Estate Leader
            </p>

            {/* Description text color updated */}
            <p className="text-lg text-[#E3DCD2] mb-10 max-w-2xl mx-auto lg:mx-0">
              Shaping the future of business in Kurdistan through innovation, integrity, and purpose.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <button
                onClick={scrollToContact}
                // Updated button gradient colors
                className="inline-flex items-center px-8 py-4 bg-[#CC8B65] hover:bg-[#CC8B65]/80 text-[#100C0D] font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                Get In Touch
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>

              <button
                onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
                // Updated border and hover colors
                className="inline-flex items-center px-8 py-4 border-2 border-[#E3DCD2]/30 hover:border-[#CC8B65] text-[#E3DCD2] font-semibold rounded-lg transition-all duration-300 hover:bg-[#E3DCD2]/10 hover:shadow-lg"
              >
                Learn More
              </button>
            </div>

            {/* Social Media Links */}
            <div className="flex justify-center lg:justify-start space-x-6">
              <a href="#" className="text-[#E3DCD2]/70 hover:text-[#CC8B65] transition-all duration-300 transform hover:scale-110">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-[#E3DCD2]/70 hover:text-[#CC8B65] transition-all duration-300 transform hover:scale-110">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-[#E3DCD2]/70 hover:text-[#CC8B65] transition-all duration-300 transform hover:scale-110">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 border-2 border-[#E3DCD2]/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[#E3DCD2]/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}

export default Hero
