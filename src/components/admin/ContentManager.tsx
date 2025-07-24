import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Save, Edit, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface ContentSection {
  id: string
  section: string
  key: string
  value: any
  description: string
}

const ContentManager: React.FC = () => {
  const [content, setContent] = useState<ContentSection[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .order('section', { ascending: true })

      if (error) throw error
      setContent(data || [])
    } catch (error) {
      console.error('Error fetching content:', error)
      showMessage('error', 'Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const updateContent = async (id: string, newValue: any) => {
    setSaving(id)
    try {
      const { error } = await supabase
        .from('website_content')
        .update({ 
          value: typeof newValue === 'string' ? JSON.stringify(newValue) : newValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      setContent(prev => prev.map(item => 
        item.id === id 
          ? { ...item, value: typeof newValue === 'string' ? JSON.stringify(newValue) : newValue }
          : item
      ))
      
      setEditingId(null)
      showMessage('success', 'Content updated successfully')
    } catch (error) {
      console.error('Error updating content:', error)
      showMessage('error', 'Failed to update content')
    } finally {
      setSaving(null)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const renderContentEditor = (item: ContentSection) => {
    const isEditing = editingId === item.id
    const isSaving = saving === item.id
    
    let displayValue = item.value
    let inputValue = item.value

    // Handle JSON values
    if (typeof item.value === 'string' && item.value.startsWith('"') && item.value.endsWith('"')) {
      displayValue = JSON.parse(item.value)
      inputValue = JSON.parse(item.value)
    } else if (typeof item.value === 'object') {
      displayValue = JSON.stringify(item.value, null, 2)
      inputValue = JSON.stringify(item.value, null, 2)
    }

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 capitalize">
              {item.section} - {item.key.replace('_', ' ')}
            </h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setEditingId(item.id)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                <Edit className="h-5 w-5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => setEditingId(null)}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <EyeOff className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            {item.key.includes('content') && typeof item.value === 'object' ? (
              <div className="space-y-3">
                {Object.entries(item.value).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <textarea
                      defaultValue={value as string}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                      rows={3}
                      onChange={(e) => {
                        const newValue = { ...item.value, [key]: e.target.value }
                        item.value = newValue
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <textarea
                defaultValue={inputValue}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                rows={displayValue.length > 100 ? 6 : 3}
                onChange={(e) => {
                  inputValue = e.target.value
                }}
              />
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEditingId(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => updateContent(item.id, inputValue)}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 flex items-center"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {typeof displayValue === 'object' 
                ? JSON.stringify(displayValue, null, 2)
                : displayValue
              }
            </pre>
          </div>
        )}
      </motion.div>
    )
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
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Website Content Management</h1>
        <p className="text-gray-600">
          Edit and update the content displayed on your website. Changes will be reflected immediately.
        </p>
      </div>

      {/* Success/Error Messages */}
      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`p-4 rounded-lg flex items-center ${
            message.type === 'success' 
              ? 'bg-emerald-50 border border-emerald-200' 
              : 'bg-red-50 border border-red-200'
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

      {/* Content Sections */}
      <div className="grid gap-6">
        {content.map(item => renderContentEditor(item))}
      </div>

      {content.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Found</h3>
          <p className="text-gray-600">
            Website content will appear here once the database is properly configured.
          </p>
        </div>
      )}
    </div>
  )
}

export default ContentManager