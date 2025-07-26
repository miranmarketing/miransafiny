// components/Layout.tsx
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo) {
      const sectionId = location.state.scrollTo
      const element = document.querySelector(sectionId)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100) // Small delay to ensure DOM ready
      }
    }
  }, [location])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-[#100C0D]">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
