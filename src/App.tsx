import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminDashboard from './components/admin/AdminDashboard'
import Hero from './components/Hero'
import About from './components/About'
import Vision from './components/Vision'
import Biography from './components/Biography'
import Achievements from './components/Achievements'
import Philosophy from './components/Philosophy'
import Community from './components/Community'
import Articles from './components/Articles'
import Contact from './components/Contact'
import Layout from './components/Layout'
import ArticleDetail from './components/ArticleDetail'
// (keep your other imports)

function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminDashboard />} />

      <Route
        path="/"
        element={
          <Layout>
            <Hero />
                        <Articles />

            <About />
            <Vision />
            <Biography />
            <Achievements />
            <Philosophy />
            <Community />
            <Contact />
          </Layout>
        }
      />

      <Route
        path="/articles"
        element={
          <Layout>
            <Articles />
          </Layout>
        }
      />

      {/* ✅ Dynamic article route */}
      <Route
        path="/articles/:slug"
        element={
          <Layout>
            <ArticleDetail />
          </Layout>
        }
      />
    </Routes>
  )
}
export default App
