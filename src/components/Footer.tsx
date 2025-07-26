import React from 'react'
import { Linkedin, Instagram, Facebook, MessageSquare, ArrowUp } from 'lucide-react'

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const socialLinks = [
    { icon: Linkedin, url: "https://linkedin.com/in/miransafiny", name: "LinkedIn" },
    { icon: Instagram, url: "https://instagram.com/miransafiny", name: "Instagram" },
    { icon: Facebook, url: "https://www.facebook.com/Miransafiny", name: "Twitter" },
    { icon: MessageSquare, url: "https://wa.me/9647501234567", name: "WhatsApp" }
  ]

  const quickLinks = [
    { name: "About", href: "#about" },
    { name: "Vision", href: "#vision" },
    { name: "Achievements", href: "#achievements" },
    { name: "Articles", href: "#articles" },
    { name: "Contact", href: "#contact" }
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    // Updated footer background to primary dark color
    <footer className="bg-[#100C0D] text-[#E3DCD2] relative">
      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        // Updated button background and hover colors to accent
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#CC8B65] hover:bg-[#CC8B65]/80 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 shadow-lg"
      >
        <ArrowUp className="h-6 w-6 text-[#100C0D]" /> {/* Icon color to dark */}
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            {/* Updated heading text color */}
            <h3 className="text-2xl font-bold mb-4 text-[#E3DCD2]">Miran Safiny</h3>
            {/* Updated paragraph text color */}
            <p className="text-[#E3DCD2]/80 mb-6 max-w-md">
              Vision-driven entrepreneur shaping the future of business in Kurdistan through 
              innovation, integrity, and purpose.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  // Updated social icon background and hover colors
                  className="bg-[#013328] hover:bg-[#CC8B65] w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5 text-[#E3DCD2]" /> {/* Icon color to light beige */}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            {/* Updated heading text color */}
            <h4 className="text-lg font-semibold mb-4 text-[#E3DCD2]">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    // Updated link text and hover colors
                    className="text-[#E3DCD2]/80 hover:text-[#CC8B65] transition-colors duration-200"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            {/* Updated heading text color */}
            <h4 className="text-lg font-semibold mb-4 text-[#E3DCD2]">Contact</h4>
            <div className="space-y-2 text-[#E3DCD2]/80">
              <p>Erbil, Kurdistan Region</p>
              <p>Iraq</p>
              <a href="mailto:contact@miransafiny.com" className="hover:text-[#CC8B65] transition-colors duration-200">
                contact@miransafiny.com
              </a>
              <a href="https://wa.me/9647501234567" className="hover:text-[#CC8B65] transition-colors duration-200">
                +964 750 123 4567
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#013328] pt-8 flex flex-col md:flex-row justify-between items-center">
          {/* Updated copyright text color */}
          <p className="text-[#E3DCD2]/60 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Miran Safiny. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-[#E3DCD2]/60">
            <a href="#" className="hover:text-[#CC8B65] transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-[#CC8B65] transition-colors duration-200">Terms of Service</a>
            <a href="#" className="hover:text-[#CC8B65] transition-colors duration-200">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
