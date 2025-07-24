import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Save, Globe, Mail, Phone, MapPin, AlertCircle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface SiteSetting {
  id: string
  key: string
  value: any
  description: string
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key', { ascending: true })

      if (error) throw error
      
      const settingsData = data || []
      setSettings(settingsData)
      
      // Initialize form data
      const initialFormData: Record<string, string> = {}
      settingsData.forEach(setting => {
        initialFormData[setting.key] = typeof setting.value === 'string' 
          ? JSON.parse(setting.value) 
          : setting.value
      })
      setFormData(initialFormData)
    } catch (error) {
      console.error('Error fetching settings:', error)
      showMessage('error', 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const updates = Object.entries(formData).map(([key, value]) => ({
        key,
        value: JSON.stringify(value),
        updated_at: new Date().toISOString()
      }))

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .upsert(update, { onConflict: 'key' })

        if (error) throw error
      }

      showMessage('success', 'Settings saved successfully')
      fetchSettings()
    } catch (error) {
      console.error('Error saving settings:', error)
      showMessage('error', 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const settingGroups = [
    {
      title: 'Site Information',
      icon: Globe,
      settings: ['site_title', 'site_description']
    },
    {
      title: 'Social Media',
      icon: Globe,
      settings: ['social_linkedin', 'social_instagram', 'social_twitter', 'social_whatsapp']
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
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Site Settings</h1>
        <p className="text-gray-600">
          Configure your website's global settings and social media links.
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

      {/* Settings Groups */}
      <div className="space-y-6">
        {settingGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                <group.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{group.title}</h2>
            </div>

            <div className="space-y-4">
              {group.settings.map(settingKey => {
                const setting = settings.find(s => s.key === settingKey)
                if (!setting) return null

                return (
                  <div key={settingKey}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {settingKey.replace('_', ' ').replace('social ', '')}
                    </label>
                    <input
                      type={settingKey.includes('url') || settingKey.includes('social') ? 'url' : 'text'}
                      value={formData[settingKey] || ''}
                      onChange={(e) => handleInputChange(settingKey, e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={setting.description}
                    />
                    {setting.description && (
                      <p className="text-xs text-gray-500 mt-1">{setting.description}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 flex items-center"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Save Settings
            </>
          )}
        </button>
      </div>

      {/* Additional Settings Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Settings Information</h3>
        <div className="text-blue-700 space-y-2 text-sm">
          <p>• Changes to site settings will be reflected across the entire website</p>
          <p>• Social media links will appear in the footer and contact sections</p>
          <p>• Make sure to use complete URLs for social media links (including https://)</p>
          <p>• Site title and description are used for SEO and browser titles</p>
        </div>
      </div>
    </div>
  )
}

export default Settings