import React, { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isAppLang } from '../utils/locale'

const SITE = 'https://miransafiny.com'

/**
 * Default / listing page SEO (title, description, canonical). Article pages set their own meta in ArticleDetail.
 */
const SiteSeo: React.FC = () => {
  const { t } = useTranslation()
  const { lang: langParam } = useParams<{ lang?: string }>()
  const { pathname } = useLocation()
  const lang = isAppLang(langParam) ? langParam : 'en'

  useEffect(() => {
    const isArticlePage = /^\/(en|ar|ckb)\/articles\/[^/]+/.test(pathname)
    if (isArticlePage) return

    const origin = typeof window !== 'undefined' ? window.location.origin : SITE
    const path = pathname || `/${lang}`
    const canonical = `${origin}${path === '/' ? `/${lang}` : path}`.replace(/\/+$/, '') || `${origin}/${lang}`

    let title = t('seo.defaultTitle')
    let description = t('seo.defaultDescription')
    if (/^\/(en|ar|ckb)\/?$/.test(pathname)) {
      title = t('seo.homeTitle')
      description = t('seo.homeDescription')
    } else if (/^\/(en|ar|ckb)\/articles\/?$/.test(pathname)) {
      title = t('seo.articlesTitle')
      description = t('seo.articlesDescription')
    }

    document.title = title

    const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.content = content
    }

    setMeta('description', description)
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:url', canonical, 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('og:site_name', 'Miran Safiny', 'property')
    setMeta('og:image', `${origin}/miran.png`, 'property')
    setMeta('twitter:card', 'summary_large_image', 'name')
    setMeta('twitter:title', title, 'name')
    setMeta('twitter:description', description, 'name')
    setMeta('twitter:image', `${origin}/miran.png`, 'name')

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = canonical
    link.dataset.siteSeo = '1'

    return () => {
      document.querySelectorAll('link[data-site-seo="1"]').forEach((el) => el.remove())
    }
  }, [pathname, lang, t])

  return null
}

export default SiteSeo
