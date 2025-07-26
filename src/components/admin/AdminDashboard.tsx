import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import AdminLogin from './AdminLogin'
import AdminLayout from './AdminLayout'
import Dashboard from './Dashboard'
import ContentManager from './ContentManager'
import ArticleManager from './ArticleManager'
import Settings from './Settings'

const AdminDashboard: React.FC = () => {
  const { user, loading } = useAuth()
  const [currentPage, setCurrentPage] = useState('dashboard')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 ">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <AdminLogin />
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={setCurrentPage} />
      case 'content':
        return <ContentManager onPageChange={setCurrentPage} />
      case 'articles':
        return <ArticleManager onPageChange={setCurrentPage} />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard onPageChange={setCurrentPage} />
    }
  }

  return (
    <AdminLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </AdminLayout>
  )
}

export default AdminDashboard