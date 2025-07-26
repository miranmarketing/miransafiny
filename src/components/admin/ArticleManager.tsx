import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useForm } from 'react-hook-form'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Save, 
  X, 
  Calendar,
  Tag,
  Image,
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  slug: string
  author: string
  image_url?: string
  tags?: string[]
  published_at?: string
  created_at: string
  updated_at: string
}

interface ArticleFormData {
  title: string
  excerpt: string
  content: string
  slug: string
  author: string
  image_url: string
  tags: string
  published_at: string
}

interface ArticleManagerProps {
  onPageChange?: (page: string) => void
}

const ArticleManager: React.FC<ArticleManagerProps> = ({ onPageChange }) => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ArticleFormData>()

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setArticles(data || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
      showMessage('error', 'Failed to load articles')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const onSubmit = async (data: ArticleFormData) => {
    try {
      const articleData = {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        slug: data.slug || generateSlug(data.title),
        author: data.author || 'Miran Safiny',
        image_url: data.image_url || null,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : null,
        published_at: data.published_at ? new Date(data.published_at).toISOString() : null,
        updated_at: new Date().toISOString()
      }

      if (editingArticle) {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', editingArticle.id)

        if (error) throw error
        showMessage('success', 'Article updated successfully')
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([{ ...articleData, created_at: new Date().toISOString() }])

        if (error) throw error
        showMessage('success', 'Article created successfully')
      }

      setShowForm(false)
      setEditingArticle(null)
      reset()
      fetchArticles()
    } catch (error) {
      console.error('Error saving article:', error)
      showMessage('error', 'Failed to save article')
    }
  }

  const deleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setArticles(prev => prev.filter(article => article.id !== id))
      showMessage('success', 'Article deleted successfully')
    } catch (error) {
      console.error('Error deleting article:', error)
      showMessage('error', 'Failed to delete article')
    }
  }

  const editArticle = (article: Article) => {
    setEditingArticle(article)
    
    // Use setTimeout to ensure form is rendered before setting values
    setTimeout(() => {
      setValue('title', article.title)
      setValue('excerpt', article.excerpt)
      setValue('content', article.content)
      setValue('slug', article.slug)
      setValue('author', article.author)
      setValue('image_url', article.image_url || '')
      setValue('tags', article.tags?.join(', ') || '')
      setValue('published_at', article.published_at ? article.published_at.split('T')[0] : '')
    }, 100)
    
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingArticle(null)
    reset()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl shadow-2xl p-6">
        <div className="flex items-center">
          {onPageChange && (
            <button
              onClick={() => onPageChange('dashboard')}
              className="mr-4 p-2 text-slate-300 hover:text-white transition-colors duration-200"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Articles Management</h1>
            <p className="text-slate-300">Create, edit, and manage your blog articles.</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Article
        </button>
      </div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-4 rounded-lg flex items-center ${
              message.type === 'success' 
                ? 'bg-emerald-50 border border-emerald-300 shadow-lg' 
                : 'bg-red-50 border border-red-300 shadow-lg'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            )}
            <span className={message.type === 'success' ? 'text-emerald-700' : 'text-red-700'}>
              {message.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Article Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-200"
            >
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    {editingArticle ? 'Edit Article' : 'Create New Article'}
                  </h2>
                  <button
                    onClick={closeForm}
                    className="text-slate-300 hover:text-white transition-colors duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      {...register('title', { required: 'Title is required' })}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm"
                      placeholder="Article title"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug
                    </label>
                    <input
                      {...register('slug')}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm"
                      placeholder="article-slug (auto-generated if empty)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    {...register('excerpt', { required: 'Excerpt is required' })}
                    rows={3}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-vertical bg-white shadow-sm"
                    placeholder="Brief description of the article"
                  />
                  {errors.excerpt && (
                    <p className="text-red-500 text-sm mt-1">{errors.excerpt.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    {...register('content', { required: 'Content is required' })}
                    rows={12}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-vertical bg-white shadow-sm"
                    placeholder="Write your article content here..."
                  />
                  {errors.content && (
                    <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author
                    </label>
                    <input
                      {...register('author')}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm"
                      placeholder="Miran Safiny"
                      defaultValue="Miran Safiny"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publish Date
                    </label>
                    <input
                      {...register('published_at')}
                      type="date"
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image URL
                  </label>
                  <input
                    {...register('image_url')}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    {...register('tags')}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm"
                    placeholder="business, marketing, real estate (comma separated)"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-6 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {editingArticle ? 'Update Article' : 'Create Article'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Articles List */}
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-2xl overflow-hidden border border-slate-200">
        {articles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700">
                <tr>
                  <th className="text-left p-4 font-semibold text-white">Title</th>
                  <th className="text-left p-4 font-semibold text-white">Status</th>
                  <th className="text-left p-4 font-semibold text-white">Date</th>
                  <th className="text-left p-4 font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article, index) => (
                  <motion.tr
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200"
                  >
                    <td className="p-4">
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">{article.title}</h3>
                        <p className="text-sm text-slate-600 line-clamp-1">{article.excerpt}</p>
                        {article.tags && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {article.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        article.published_at 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {article.published_at ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(article.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => editArticle(article)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteArticle(article.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Articles Yet</h3>
            <p className="text-slate-600 mb-4">Create your first article to get started.</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Article
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArticleManager





