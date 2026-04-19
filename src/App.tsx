import React, { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import GA4 from 'react-ga4'

import AdminDashboard from './components/admin/AdminDashboard'
import Hero from './components/Hero'
import QuoteSection from './components/QuoteSection'
import Achievements from './components/Achievements'
import Articles from './components/Articles'
import Contact from './components/Contact'
import Layout from './components/Layout'
import ArticleDetail from './components/ArticleDetail'
import Story from './components/Story'
import About from './components/About'
import { LangRoute } from './components/LangRoute'
import { LegacyArticleDetailRedirect, LegacyArticlesRedirect } from './components/LegacyRedirects'

const GA_MEASUREMENT_ID = 'G-CFDPT88JC9'

if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-CFDPT88JC9') {
  GA4.initialize(GA_MEASUREMENT_ID)
}

const RouteChangeTracker: React.FC = () => {
  const location = useLocation()

  useEffect(() => {
    if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-CFDPT88JC9') {
      GA4.send({ hitType: 'pageview', page: location.pathname + location.search })
    }
  }, [location])

  return null
}

const HomeSections: React.FC = () => (
  <>
    <Hero />
    <QuoteSection />
    <Articles />
    <About />
    <Story />
    <Achievements />
    <Contact />
  </>
)

function App() {
  return (
    <>
      <RouteChangeTracker />

      <Routes>
        <Route path="/admin/*" element={<AdminDashboard />} />

        <Route path="/" element={<Navigate to="/en" replace />} />
        <Route path="/articles" element={<LegacyArticlesRedirect />} />
        <Route path="/articles/:slug" element={<LegacyArticleDetailRedirect />} />

        <Route
          path="/:lang"
          element={
            <LangRoute>
              <Layout>
                <HomeSections />
              </Layout>
            </LangRoute>
          }
        />

        <Route
          path="/:lang/articles"
          element={
            <LangRoute>
              <Layout>
                <Articles />
              </Layout>
            </LangRoute>
          }
        />

        <Route
          path="/:lang/articles/:slug"
          element={
            <LangRoute>
              <Layout>
                <ArticleDetail />
              </Layout>
            </LangRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
