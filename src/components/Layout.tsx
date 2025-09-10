// components/Layout.tsx
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
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
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Sidebar />
      <main className="pl-0 md:pl-64 bg-black">{children}</main>   {/* <-- bg-black */}
      <Footer />
    </div>
  )
}

export default Layout
