import React, { useEffect } from 'react'; // Import useEffect
import { Routes, Route, useLocation } from 'react-router-dom'; // Import useLocation
import GA4 from 'react-ga4'; // Import react-ga4

// Import your components
import AdminDashboard from './components/admin/AdminDashboard';
import Hero from './components/Hero';
import QuoteSection from './components/QuoteSection';
import RecentArticlesStrip from './components/RecentArticlesStrip';
import About from './components/About';
// import Vision from './components/Vision';
// import Biography from './components/Biography';
import Achievements from './components/Achievements';
// import Philosophy from './components/Philosophy';
// import Community from './components/Community';
import Articles from './components/Articles';
import Contact from './components/Contact';
import Layout from './components/Layout';
import ArticleDetail from './components/ArticleDetail';
import Story from './components/Story';

// --- Google Analytics Setup ---
// Replace with your actual Google Analytics 4 Measurement ID (starts with 'G-')
const GA_MEASUREMENT_ID = 'G-CFDPT88JC9'; // e.g., 'G-ABC123DEF4'

// Initialize GA4 only once when the application loads
if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-CFDPT88JC9') {
  GA4.initialize(GA_MEASUREMENT_ID);
} else {
}

// A custom component to track route changes
const RouteChangeTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-CFDPT88JC9') {
      // Send a pageview event to GA4 on every route change
      GA4.send({ hitType: 'pageview', page: location.pathname + location.search });
      console.log(`Page view tracked: ${location.pathname}${location.search}`);
    }
  }, [location]); // Re-run effect whenever location changes

  return null; // This component doesn't render anything visible
};

function App() {
  return (
    // Your Router (e.g., BrowserRouter) should wrap the entire application
    // This is typically done in your index.tsx or main.tsx
    // For this example, let's assume it's set up higher in the component tree.
    // If not, you'd add <BrowserRouter> around <Routes> here.
    <>
      <RouteChangeTracker /> {/* Add the route tracker here */}

      <Routes>
        <Route path="/admin/*" element={<AdminDashboard />} />

        {/* Main layout routes */}
        <Route
          path="/"
          element={
            <Layout>
              <Hero />
              <QuoteSection />
              <Articles /> {/* Articles also on the homepage */}
              <About />
              <Story />
              <Achievements />
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

        <Route
          path="/articles/:slug"
          element={
            <Layout>
              <ArticleDetail />
            </Layout>
          }
        />
      </Routes>
    </>
  );
}

export default App;