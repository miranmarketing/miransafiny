import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { FileText, Users, Eye, TrendingUp, Calendar, Edit } from 'lucide-react'
import { motion } from 'framer-motion'

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    recentArticles: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch articles stats
      const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && articles) {
        setStats({
          totalArticles: articles.length,
          publishedArticles: articles.filter(a => a.published_at).length,
          draftArticles: articles.filter(a => !a.published_at).length,
          recentArticles: articles.slice(0, 5)
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Articles',
      value: stats.totalArticles,
      icon: FileText,
      color: 'blue',
      change: '+12%'
    },
    {
      title: 'Published',
      value: stats.publishedArticles,
      icon: Eye,
      color: 'emerald',
      change: '+8%'
    },
    {
      title: 'Drafts',
      value: stats.draftArticles,
      icon: Edit,
      color: 'amber',
      change: '+3%'
    },
    {
      title: 'This Month',
      value: 5,
      icon: TrendingUp,
      color: 'purple',
      change: '+25%'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
        <p className="text-blue-100">
          Manage Miran Safiny's website content and articles from this dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`bg-${stat.color}-100 w-12 h-12 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <span className={`text-sm font-medium text-${stat.color}-600 bg-${stat.color}-50 px-2 py-1 rounded-full`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Articles */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Articles</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View All
          </button>
        </div>

        {stats.recentArticles.length > 0 ? (
          <div className="space-y-4">
            {stats.recentArticles.map((article: any, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{article.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-1">{article.excerpt}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(article.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="ml-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    article.published_at 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {article.published_at ? 'Published' : 'Draft'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No articles yet. Create your first article!</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors duration-200">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-600 mr-3" />
                <span className="font-medium text-gray-900">Create New Article</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 transition-colors duration-200">
              <div className="flex items-center">
                <Edit className="h-5 w-5 text-emerald-600 mr-3" />
                <span className="font-medium text-gray-900">Edit Website Content</span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <span className="flex items-center text-emerald-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Authentication</span>
              <span className="flex items-center text-emerald-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Last Backup</span>
              <span className="text-gray-500">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard