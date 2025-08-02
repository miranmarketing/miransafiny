import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: t('nav.home'), href: '#home' },
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.vision'), href: '#vision' },
    { name: t('nav.achievements'), href: '#achievements' },
    { name: t('nav.articles'), href: '#articles' },
    { name: t('nav.contact'), href: '#contact' }
  ]

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false)

    if (location.pathname === '/') {
      const element = document.querySelector(sectionId)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    } else {
      navigate('/', { state: { scrollTo: sectionId } })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#100C0D]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="text-2xl font-bold text-[#CC8B65]">
            {t('hero.title')}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-sm font-medium text-[#E3DCD2] hover:text-[#CC8B65] transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}
            <LanguageSwitcher />
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-[#E3DCD2]" />
            ) : (
              <Menu className="h-6 w-6 text-[#E3DCD2]" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#013328] rounded-lg shadow-lg mt-2 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left px-4 py-2 text-[#E3DCD2] hover:bg-[#CC8B65]/20 hover:text-[#CC8B65] transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}
            <div className="px-4 py-2 border-t border-[#CC8B65]/30 mt-4 pt-4">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
