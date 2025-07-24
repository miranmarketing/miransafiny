import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminDashboard from './components/admin/AdminDashboard'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Vision from './components/Vision'
import Biography from './components/Biography'
import Achievements from './components/Achievements'
import Philosophy from './components/Philosophy'
import Community from './components/Community'
import Skills from './components/Skills'
import Articles from './components/Articles'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="/" element={
        <div className="min-h-screen">
          <Header />
          <main>
            <Hero />
            <About />
            <Vision />
            <Biography />
            <Achievements />
            <Philosophy />
            <Community />
            <Skills />
            <Articles />
            <Contact />
          </main>
          <Footer />
        </div>
      } />
    </Routes>
  )
}

export default App