import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
  article?: {
    author?: string
    publishedTime?: string
    modifiedTime?: string
    tags?: string[]
  }
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  article
}) => {
  const { language, t } = useLanguage()

  const defaultTitle = t('hero.title')
  const defaultDescription = t('hero.description')
  const currentUrl = url || window.location.href
  const currentImage = image || `${window.location.origin}/miransafiny.png`

  const seoTitle = title ? `${title} | ${defaultTitle}` : `${defaultTitle} | ${t('hero.subtitle')}`
  const seoDescription = description || defaultDescription

  React.useEffect(() => {
    // Update document title
    document.title = seoTitle

    // Update or create meta tags
    const updateMetaTag = (property: string, content: string, attribute: 'property' | 'name' = 'property') => {
      let tag = document.head.querySelector(`meta[${attribute}="${property}"]`) as HTMLMetaElement
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attribute, property)
        document.head.appendChild(tag)
      }
      tag.content = content
    }

    // Basic meta tags
    updateMetaTag('description', seoDescription, 'name')
    if (keywords) updateMetaTag('keywords', keywords, 'name')
    updateMetaTag('author', 'Miran Safiny', 'name')
    updateMetaTag('robots', 'index, follow', 'name')
    updateMetaTag('language', language, 'name')

    // Open Graph tags
    updateMetaTag('og:title', seoTitle)
    updateMetaTag('og:description', seoDescription)
    updateMetaTag('og:type', type)
    updateMetaTag('og:url', currentUrl)
    updateMetaTag('og:image', currentImage)
    updateMetaTag('og:image:width', '1200')
    updateMetaTag('og:image:height', '630')
    updateMetaTag('og:image:alt', title || defaultTitle)
    updateMetaTag('og:locale', language === 'en' ? 'en_US' : language === 'ar' ? 'ar_AR' : 'ku_IQ')
    updateMetaTag('og:site_name', defaultTitle)

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name')
    updateMetaTag('twitter:site', '@miran_marketing', 'name')
    updateMetaTag('twitter:creator', '@miran_marketing', 'name')
    updateMetaTag('twitter:title', seoTitle, 'name')
    updateMetaTag('twitter:description', seoDescription, 'name')
    updateMetaTag('twitter:image', currentImage, 'name')
    updateMetaTag('twitter:image:alt', title || defaultTitle, 'name')

    // Article specific tags
    if (article && type === 'article') {
      if (article.author) updateMetaTag('article:author', article.author)
      if (article.publishedTime) updateMetaTag('article:published_time', article.publishedTime)
      if (article.modifiedTime) updateMetaTag('article:modified_time', article.modifiedTime)
      if (article.tags) {
        article.tags.forEach(tag => {
          const tagElement = document.createElement('meta')
          tagElement.setAttribute('property', 'article:tag')
          tagElement.content = tag
          document.head.appendChild(tagElement)
        })
      }
    }

    // Canonical URL
    let canonicalLink = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href = currentUrl

    // Language alternates
    const languages = [
      { code: 'en', url: currentUrl.replace(/\/(ku|ar)\//, '/').replace(/\/(ku|ar)$/, '') },
      { code: 'ku', url: currentUrl.includes('/ku') ? currentUrl : `${currentUrl}/ku` },
      { code: 'ar', url: currentUrl.includes('/ar') ? currentUrl : `${currentUrl}/ar` }
    ]

    // Remove existing alternate links
    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach(link => link.remove())

    languages.forEach(lang => {
      const alternateLink = document.createElement('link')
      alternateLink.rel = 'alternate'
      alternateLink.hreflang = lang.code
      alternateLink.href = lang.url
      document.head.appendChild(alternateLink)
    })

    // Default alternate
    const defaultAlternateLink = document.createElement('link')
    defaultAlternateLink.rel = 'alternate'
    defaultAlternateLink.hreflang = 'x-default'
    defaultAlternateLink.href = languages[0].url
    document.head.appendChild(defaultAlternateLink)

  }, [seoTitle, seoDescription, keywords, currentUrl, currentImage, type, article, language])

  return null
}

export default SEOHead