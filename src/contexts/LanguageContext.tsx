import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'ku' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.vision': 'Vision',
    'nav.achievements': 'Achievements',
    'nav.articles': 'Articles',
    'nav.contact': 'Contact',
    
    // Hero Section
    'hero.title': 'Miran Safiny',
    'hero.subtitle': 'Vision-Driven Entrepreneur | Marketing Strategist | Real Estate Leader',
    'hero.description': 'Shaping the future of business in Kurdistan through innovation, integrity, and purpose.',
    'hero.location': 'Erbil, Kurdistan Region, Iraq',
    'hero.getInTouch': 'Get In Touch',
    'hero.learnMore': 'Learn More',
    
    // About Section
    'about.title': 'About Miran',
    'about.description1': 'Miran Safiny is a visionary entrepreneur and business leader based in Erbil, Kurdistan Region, Iraq. With a sharp eye for emerging trends and a reputation for execution, Miran has built and managed multiple successful ventures across real estate, marketing, and renewable energy sectors.',
    'about.description2': 'Driven by a belief in sustainable development, customer trust, and regional transformation, Miran continues to pioneer initiatives that bring global business standards to local markets. Whether leading creative campaigns or launching infrastructure projects, his work is always rooted in value creation and long-term impact.',
    
    // Articles
    'articles.title': 'Latest Articles',
    'articles.description': 'Insights, analysis, and perspectives on business, technology, and regional development.',
    'articles.search': 'Search articles...',
    'articles.readMore': 'Read More',
    'articles.noArticles': 'No articles found matching your search.',
    'articles.by': 'By',
    'articles.on': 'on',
    
    // Contact
    'contact.title': 'Get In Touch',
    'contact.description': 'Ready to discuss partnerships, consultations, or media opportunities? Let\'s connect and explore how we can work together.',
    'contact.info': 'Contact Information',
    'contact.email': 'Email',
    'contact.whatsapp': 'WhatsApp Business',
    'contact.location': 'Location',
    'contact.follow': 'Follow Miran',
    'contact.sendMessage': 'Send a Message',
    'contact.fullName': 'Full Name',
    'contact.emailAddress': 'Email Address',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.sending': 'Sending...',
    
    // Footer
    'footer.description': 'Vision-driven entrepreneur shaping the future of business in Kurdistan through innovation, integrity, and purpose.',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.sitemap': 'Sitemap'
  },
  ku: {
    // Navigation
    'nav.home': 'سەرەتا',
    'nav.about': 'دەربارە',
    'nav.vision': 'ڕوانگە',
    'nav.achievements': 'دەستکەوتەکان',
    'nav.articles': 'وتارەکان',
    'nav.contact': 'پەیوەندی',
    
    // Hero Section
    'hero.title': 'میران سافینی',
    'hero.subtitle': 'بازرگانی بە ڕوانگە | ستراتیژیستی مارکێتینگ | ڕابەری خانووبەرە',
    'hero.description': 'شێوەپێدانی داهاتووی بازرگانی لە کوردستان لە ڕێگەی داهێنان، دروستی و مەبەست.',
    'hero.location': 'هەولێر، هەرێمی کوردستان، عێراق',
    'hero.getInTouch': 'پەیوەندی بکە',
    'hero.learnMore': 'زیاتر بزانە',
    
    // About Section
    'about.title': 'دەربارەی میران',
    'about.description1': 'میران سافینی بازرگانێکی بە ڕوانگە و ڕابەرێکی بازرگانییە کە لە هەولێر، هەرێمی کوردستان، عێراق نیشتەجێیە. بە چاوێکی تیژ بۆ ڕەوتە نوێکان و ناوبانگێک بۆ جێبەجێکردن، میران چەندین کاروباری سەرکەوتووی دروستکردووە و بەڕێوەبردووە لە بوارەکانی خانووبەرە، مارکێتینگ و وزەی نوێکەرەوە.',
    'about.description2': 'بە هاندانی باوەڕێک بە گەشەسەندنی بەردەوام، متمانەی کڕیار و گۆڕانی هەرێمی، میران بەردەوامە لە پێشەنگیکردنی دەستپێشخەریەکان کە ستانداردە جیهانیەکانی بازرگانی بۆ بازاڕە خۆجێیەکان دەهێنێت.',
    
    // Articles
    'articles.title': 'نوێترین وتارەکان',
    'articles.description': 'تێڕوانین، شیکردنەوە و بۆچوونەکان لەسەر بازرگانی، تەکنەلۆژیا و گەشەسەندنی هەرێمی.',
    'articles.search': 'گەڕان لە وتارەکان...',
    'articles.readMore': 'زیاتر بخوێنەوە',
    'articles.noArticles': 'هیچ وتارێک نەدۆزرایەوە کە لەگەڵ گەڕانەکەت بگونجێت.',
    'articles.by': 'لەلایەن',
    'articles.on': 'لە',
    
    // Contact
    'contact.title': 'پەیوەندی بکە',
    'contact.description': 'ئامادەیت بۆ گفتوگۆ لەسەر هاوبەشی، ڕاوێژکاری یان دەرفەتەکانی میدیا؟ با پەیوەندی بکەین و بگەڕێین بۆ ئەوەی چۆن پێکەوە کار بکەین.',
    'contact.info': 'زانیاریەکانی پەیوەندی',
    'contact.email': 'ئیمەیڵ',
    'contact.whatsapp': 'واتساپی بازرگانی',
    'contact.location': 'شوێن',
    'contact.follow': 'میران بەدوابکەوە',
    'contact.sendMessage': 'پەیامێک بنێرە',
    'contact.fullName': 'ناوی تەواو',
    'contact.emailAddress': 'ناونیشانی ئیمەیڵ',
    'contact.subject': 'بابەت',
    'contact.message': 'پەیام',
    'contact.send': 'پەیام بنێرە',
    'contact.sending': 'ناردن...',
    
    // Footer
    'footer.description': 'بازرگانی بە ڕوانگە کە داهاتووی بازرگانی لە کوردستان شێوە دەدات لە ڕێگەی داهێنان، دروستی و مەبەستەوە.',
    'footer.quickLinks': 'بەستەرە خێراکان',
    'footer.contact': 'پەیوەندی',
    'footer.rights': 'هەموو مافەکان پارێزراون.',
    'footer.privacy': 'سیاسەتی تایبەتمەندی',
    'footer.terms': 'مەرجەکانی خزمەتگوزاری',
    'footer.sitemap': 'نەخشەی ماڵپەڕ'
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.about': 'حول',
    'nav.vision': 'الرؤية',
    'nav.achievements': 'الإنجازات',
    'nav.articles': 'المقالات',
    'nav.contact': 'اتصل',
    
    // Hero Section
    'hero.title': 'ميران سافيني',
    'hero.subtitle': 'رائد أعمال ذو رؤية | استراتيجي تسويق | قائد عقاري',
    'hero.description': 'تشكيل مستقبل الأعمال في كردستان من خلال الابتكار والنزاهة والهدف.',
    'hero.location': 'أربيل، إقليم كردستان، العراق',
    'hero.getInTouch': 'تواصل معنا',
    'hero.learnMore': 'اعرف المزيد',
    
    // About Section
    'about.title': 'حول ميران',
    'about.description1': 'ميران سافيني رائد أعمال ذو رؤية وقائد أعمال مقره في أربيل، إقليم كردستان، العراق. بعين حادة للاتجاهات الناشئة وسمعة في التنفيذ، بنى ميران وأدار عدة مشاريع ناجحة عبر قطاعات العقارات والتسويق والطاقة المتجددة.',
    'about.description2': 'مدفوعاً بالإيمان بالتنمية المستدامة وثقة العملاء والتحول الإقليمي، يواصل ميران ريادة المبادرات التي تجلب معايير الأعمال العالمية إلى الأسواق المحلية.',
    
    // Articles
    'articles.title': 'أحدث المقالات',
    'articles.description': 'رؤى وتحليلات ووجهات نظر حول الأعمال والتكنولوجيا والتنمية الإقليمية.',
    'articles.search': 'البحث في المقالات...',
    'articles.readMore': 'اقرأ المزيد',
    'articles.noArticles': 'لم يتم العثور على مقالات تطابق بحثك.',
    'articles.by': 'بواسطة',
    'articles.on': 'في',
    
    // Contact
    'contact.title': 'تواصل معنا',
    'contact.description': 'مستعد لمناقشة الشراكات أو الاستشارات أو الفرص الإعلامية؟ دعنا نتواصل ونستكشف كيف يمكننا العمل معاً.',
    'contact.info': 'معلومات الاتصال',
    'contact.email': 'البريد الإلكتروني',
    'contact.whatsapp': 'واتساب الأعمال',
    'contact.location': 'الموقع',
    'contact.follow': 'تابع ميران',
    'contact.sendMessage': 'إرسال رسالة',
    'contact.fullName': 'الاسم الكامل',
    'contact.emailAddress': 'عنوان البريد الإلكتروني',
    'contact.subject': 'الموضوع',
    'contact.message': 'الرسالة',
    'contact.send': 'إرسال الرسالة',
    'contact.sending': 'جاري الإرسال...',
    
    // Footer
    'footer.description': 'رائد أعمال ذو رؤية يشكل مستقبل الأعمال في كردستان من خلال الابتكار والنزاهة والهدف.',
    'footer.quickLinks': 'روابط سريعة',
    'footer.contact': 'اتصل',
    'footer.rights': 'جميع الحقوق محفوظة.',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'شروط الخدمة',
    'footer.sitemap': 'خريطة الموقع'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    // Get language from localStorage or browser preference
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && ['en', 'ku', 'ar'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.includes('ku')) {
        setLanguage('ku')
      } else if (browserLang.includes('ar')) {
        setLanguage('ar')
      }
    }
  }, [])

  useEffect(() => {
    // Save language preference
    localStorage.setItem('language', language)
    
    // Update document direction for RTL languages
    document.documentElement.dir = language === 'ar' || language === 'ku' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language])

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key
  }

  const value = {
    language,
    setLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}