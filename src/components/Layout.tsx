// components/Layout.tsx
import React, { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import Sidebar from './Sidebar'
import Footer from './Footer'
import SiteSeo from './SiteSeo'
import { isAppLang, isRtl, localeToBcp47 } from '../utils/locale'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const { lang } = useParams<{ lang?: string }>()

  useEffect(() => {
    if (isAppLang(lang)) {
      document.documentElement.lang = localeToBcp47(lang)
      document.documentElement.dir = isRtl(lang) ? 'rtl' : 'ltr'
    } else {
      document.documentElement.lang = 'en'
      document.documentElement.dir = 'ltr'
    }
  }, [lang])

  useEffect(() => {
    const isLangHome = /^\/(en|ar|ckb)\/?$/.test(location.pathname)
    if (isLangHome && location.state?.scrollTo) {
      const sectionId = location.state.scrollTo
      const element = document.querySelector(sectionId)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [location])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <SiteSeo />
      <Sidebar />
      {/* CHANGED: pl-0 md:pl-64 is now ps-0 md:ps-64 */}
      <main className="ps-0 md:ps-64 bg-black">{children}</main>   
      <Footer />
    </div>
  )
}

export default Layout