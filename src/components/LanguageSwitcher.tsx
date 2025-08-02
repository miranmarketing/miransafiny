import React, { useState } from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import { useLanguage, Language } from '../contexts/LanguageContext'

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'ku' as Language, name: 'کوردی', flag: '🏴' },
    { code: 'ar' as Language, name: 'العربية', flag: '🇸🇦' }
  ]

  const currentLanguage = languages.find(lang => lang.code === language)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 text-sm font-medium text-[#E3DCD2] hover:text-[#CC8B65] transition-colors duration-200 rounded-lg hover:bg-[#013328]/20"
      >
        <Globe className="h-4 w-4 mr-2" />
        <span className="mr-1">{currentLanguage?.flag}</span>
        <span className="mr-1">{currentLanguage?.name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-[#013328] rounded-lg shadow-lg border border-[#CC8B65]/30 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code)
                setIsOpen(false)
              }}
              className={`w-full flex items-center px-4 py-3 text-sm hover:bg-[#CC8B65]/20 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                language === lang.code ? 'bg-[#CC8B65]/10 text-[#CC8B65]' : 'text-[#E3DCD2]'
              }`}
            >
              <span className="mr-3 text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
              {language === lang.code && (
                <div className="ml-auto w-2 h-2 bg-[#CC8B65] rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher