import React from 'react'
import { useTranslation } from 'react-i18next'

const QuoteSection: React.FC = () => {
  const { t } = useTranslation()
  return (
    <section id="quote" className="w-full bg-black text-white py-24">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="relative inline-block max-w-4xl">
          {/* 1. Using inline style={{ lineHeight: '2' }} guarantees the spacing applies 
               even if Tailwind misses the arbitrary class. 
            2. Added pb-4 (padding-bottom) to give extra room for the blue line.
          */}
          <p 
            className="relative text-3xl md:text-5xl lg:text-6xl font-black pb-4" 
            style={{ lineHeight: '2' }}
          >
            <span className="relative z-10">{t('quote.text')}</span>
            
            {/* Dropped the line even further down (bottom-0) to sit completely under the text
            */}
            <span className="absolute start-0 bottom-0 -z-10 h-3 md:h-5 w-0 bg-[#007BFF] animate-[wipe_1.6s_ease-out_forwards]" />
          </p>
        </div>
        
        <p className="mt-10 text-sm md:text-base font-bold tracking-widest text-gray-400">
          {t('quote.attribution')}
        </p>
      </div>
      <style>{`@keyframes wipe{to{width:100%}}`}</style>
    </section>
  )
}

export default QuoteSection