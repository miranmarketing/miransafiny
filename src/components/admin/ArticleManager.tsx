import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import type { Article } from '../../lib/supabase'
import { useForm } from 'react-hook-form'
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Calendar,
  Tag,
  Image,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Video,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

type LocaleCode = 'en' | 'ar' | 'ckb'

const LOCALES: LocaleCode[] = ['en', 'ar', 'ckb']

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    [{ align: [] }],
    ['clean'],
  ],
}

interface SharedFormData {
  author: string
  image_url: string
  tags: string
  published_at: string
  video_urls: string
  hero_video_url: string
}

interface LocaleFields {
  title: string
  excerpt: string
  content: string
  slug: string
  featured_image_alt: string
}

const emptyLocale = (): LocaleFields => ({
  title: '',
  excerpt: '',
  content: '',
  slug: '',
  featured_image_alt: '',
})

interface ArticleManagerProps {
  onPageChange?: (page: string) => void
}

const ArticleManager: React.FC<ArticleManagerProps> = ({ onPageChange }) => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null)
  const [localeRows, setLocaleRows] = useState<Record<LocaleCode, string | null>>({
    en: null,
    ar: null,
    ckb: null,
  })
  const [tab, setTab] = useState<LocaleCode>('en')
  const [locales, setLocales] = useState<Record<LocaleCode, LocaleFields>>({
    en: emptyLocale(),
    ar: emptyLocale(),
    ckb: emptyLocale(),
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const { register, handleSubmit, reset, setValue } = useForm<SharedFormData>({
    defaultValues: {
      author: 'Miran Safiny',
      image_url: '',
      tags: '',
      published_at: '',
      video_urls: '',
      hero_video_url: '',
    },
  })

  const fetchArticles = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setArticles(data || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
      showMessage('error', 'Failed to load articles')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchArticles()
  }, [fetchArticles])

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

  const grouped = useMemo(() => {
    const m = new Map<string, Article[]>()
    for (const a of articles) {
      const g = a.translation_group_id || a.id
      if (!m.has(g)) m.set(g, [])
      m.get(g)!.push(a)
    }
    return Array.from(m.entries())
  }, [articles])

  const resetForm = () => {
    setEditingGroupId(null)
    setLocaleRows({ en: null, ar: null, ckb: null })
    setLocales({ en: emptyLocale(), ar: emptyLocale(), ckb: emptyLocale() })
    setTab('en')
    reset()
  }

  const closeForm = () => {
    setShowForm(false)
    resetForm()
  }

  const loadGroup = (rows: Article[]) => {
    const nextLocales: Record<LocaleCode, LocaleFields> = {
      en: emptyLocale(),
      ar: emptyLocale(),
      ckb: emptyLocale(),
    }
    const nextIds: Record<LocaleCode, string | null> = { en: null, ar: null, ckb: null }
    const shared = rows[0]
    for (const r of rows) {
      const loc = (r.locale || 'en') as LocaleCode
      if (LOCALES.includes(loc)) {
        nextLocales[loc] = {
          title: r.title,
          excerpt: r.excerpt || '',
          content: r.content || '',
          slug: r.slug,
          featured_image_alt: r.featured_image_alt || '',
        }
        nextIds[loc] = r.id
      }
    }
    setLocales(nextLocales)
    setLocaleRows(nextIds)
    setEditingGroupId(shared.translation_group_id || shared.id)
    setValue('author', shared.author || 'Miran Safiny')
    setValue('image_url', shared.image_url || '')
    setValue('tags', shared.tags?.join(', ') || '')
    setValue('published_at', shared.published_at ? shared.published_at.split('T')[0] : '')
    setValue('video_urls', (shared.video_urls || []).join('\n'))
    setValue('hero_video_url', shared.hero_video_url || '')
    setTab('en')
    setShowForm(true)
  }

  const onSubmit = async (shared: SharedFormData) => {
    for (const loc of LOCALES) {
      const L = locales[loc]
      if (!L.title?.trim() || !L.excerpt?.trim() || !L.content?.trim()) {
        showMessage('error', `Please complete all fields for ${loc.toUpperCase()} (title, excerpt, and content).`)
        setTab(loc)
        return
      }
    }

    const groupId = editingGroupId || crypto.randomUUID()
    const tags = shared.tags ? shared.tags.split(',').map((t) => t.trim()).filter(Boolean) : null
    const published_at = shared.published_at ? new Date(shared.published_at).toISOString() : null
    const video_urls = shared.video_urls
      ? shared.video_urls
          .split(/\n/)
          .map((s) => s.trim())
          .filter(Boolean)
      : []

    try {
      for (const loc of LOCALES) {
        const L = locales[loc]
        const slug = (L.slug || generateSlug(L.title)).trim()
        if (!slug) {
          showMessage('error', `Set a URL slug for ${loc.toUpperCase()} (Latin slug recommended for URLs).`)
          setTab(loc)
          return
        }
        const payload = {
          title: L.title.trim(),
          excerpt: L.excerpt.trim(),
          content: L.content,
          slug,
          author: shared.author || 'Miran Safiny',
          image_url: shared.image_url || null,
          featured_image_alt: L.featured_image_alt?.trim() || null,
          hero_video_url: shared.hero_video_url?.trim() || null,
          tags,
          published_at,
          updated_at: new Date().toISOString(),
          locale: loc,
          translation_group_id: groupId,
          video_urls,
        }

        const rowId = localeRows[loc]
        if (rowId) {
          const { error } = await supabase.from('articles').update(payload).eq('id', rowId)
          if (error) throw error
        } else {
          const { error } = await supabase
            .from('articles')
            .insert([{ ...payload, created_at: new Date().toISOString() }])
          if (error) throw error
        }
      }

      showMessage('success', editingGroupId ? 'Article group updated' : 'Article group created')
      closeForm()
      void fetchArticles()
    } catch (error: unknown) {
      console.error('Error saving article:', error)
      const msg =
        error && typeof error === 'object' && 'message' in error
          ? String((error as { message: string }).message)
          : 'Unknown error'
      const code = error && typeof error === 'object' && 'code' in error ? String((error as { code: string }).code) : ''
      if (code === 'PGRST204' || msg.includes("'locale'")) {
        showMessage(
          'error',
          'Database is missing article columns (locale, etc.). Open Supabase → SQL Editor and run the file supabase/migrations/20260419120000_multilingual_articles.sql, then try again.'
        )
      } else if (code === '23505') {
        showMessage('error', 'Slug already exists for that language — use a different slug for one of the locales.')
      } else {
        showMessage('error', msg)
      }
    }
  }

  const deleteGroup = async (groupId: string) => {
    if (!confirm('Delete this article in all languages?')) return
    try {
      const { error } = await supabase.from('articles').delete().eq('translation_group_id', groupId)
      if (error) throw error
      void fetchArticles()
      showMessage('success', 'Deleted')
    } catch (error) {
      console.error(error)
      showMessage('error', 'Failed to delete')
    }
  }

  const updateLocale = (loc: LocaleCode, patch: Partial<LocaleFields>) => {
    setLocales((prev) => ({ ...prev, [loc]: { ...prev[loc], ...patch } }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl shadow-2xl p-6">
        <div className="flex items-center">
          {onPageChange && (
            <button
              type="button"
              onClick={() => onPageChange('dashboard')}
              className="mr-4 p-2 text-slate-300 hover:text-white transition-colors duration-200"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Articles (EN / AR / کوردی)</h1>
            <p className="text-slate-300">Each article is saved in three languages for SEO and readers.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          New article
        </button>
      </div>

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
            <span className={message.type === 'success' ? 'text-emerald-700' : 'text-red-700'}>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto border border-slate-200"
            >
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    {editingGroupId ? 'Edit article (3 languages)' : 'New article (3 languages)'}
                  </h2>
                  <button type="button" onClick={closeForm} className="text-slate-300 hover:text-white transition-colors duration-200">
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
                  {LOCALES.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setTab(loc)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                        tab === loc ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {loc === 'en' ? 'English' : loc === 'ar' ? 'العربية' : 'کوردی (سۆرانی)'}
                    </button>
                  ))}
                </div>

                {LOCALES.map((loc) => (
                  <div key={loc} className={tab === loc ? 'space-y-4' : 'hidden'}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                        <input
                          value={locales[loc].title}
                          onChange={(e) => updateLocale(loc, { title: e.target.value })}
                          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white shadow-sm"
                          placeholder="Title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">URL slug</label>
                        <input
                          value={locales[loc].slug}
                          onChange={(e) => updateLocale(loc, { slug: e.target.value })}
                          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white shadow-sm"
                          placeholder="auto from title if empty"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt *</label>
                      <textarea
                        value={locales[loc].excerpt}
                        onChange={(e) => updateLocale(loc, { excerpt: e.target.value })}
                        rows={3}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 resize-y bg-white shadow-sm"
                        placeholder="Short summary for listings and SEO"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured image alt text (SEO — this language)
                      </label>
                      <input
                        value={locales[loc].featured_image_alt}
                        onChange={(e) => updateLocale(loc, { featured_image_alt: e.target.value })}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white shadow-sm"
                        placeholder="Describe the image for Google and screen readers"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content * (rich text)</label>
                      <div className="article-editor bg-white rounded-lg border border-slate-200 [&_.ql-editor]:min-h-[220px] [&_.ql-container]:text-slate-900">
                        <ReactQuill
                          theme="snow"
                          modules={quillModules}
                          value={locales[loc].content}
                          onChange={(html) => updateLocale(loc, { content: html })}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Use the toolbar for headings, lists, images, and embedded video.</p>
                    </div>
                  </div>
                ))}

                <div className="border-t border-slate-200 pt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800">Shared across languages</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                      <input
                        {...register('author')}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Publish date
                      </label>
                      <input
                        {...register('published_at')}
                        type="date"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white shadow-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Image className="h-4 w-4" /> Featured image URL
                    </label>
                    <input
                      {...register('image_url')}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white shadow-sm"
                      placeholder="https://..."
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      If you set a hero video below, it replaces this image at the top of the article (image still used for listings/SEO if provided).
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Video className="h-4 w-4" /> Hero video URL (optional — replaces featured image at top)
                    </label>
                    <input
                      {...register('hero_video_url')}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-mono text-sm bg-white shadow-sm"
                      placeholder="https://www.youtube.com/watch?v=... or Vimeo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Video className="h-4 w-4" /> Inline video URLs (one per line, below content hero)
                    </label>
                    <textarea
                      {...register('video_urls')}
                      rows={4}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-mono text-sm bg-white shadow-sm"
                      placeholder="https://www.youtube.com/watch?v=...&#10;https://vimeo.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Tag className="h-4 w-4" /> Tags
                    </label>
                    <input
                      {...register('tags')}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white shadow-sm"
                      placeholder="comma separated"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
                  <button type="button" onClick={closeForm} className="px-6 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors duration-200">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Save all languages
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-2xl overflow-hidden border border-slate-200">
        {grouped.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700">
                <tr>
                  <th className="text-left p-4 font-semibold text-white">Title (EN)</th>
                  <th className="text-left p-4 font-semibold text-white">Locales</th>
                  <th className="text-left p-4 font-semibold text-white">Date</th>
                  <th className="text-left p-4 font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {grouped.map(([groupId, rows]) => {
                  const en = rows.find((r) => r.locale === 'en') || rows[0]
                  const locs = rows.map((r) => r.locale || '?').join(', ')
                  return (
                    <motion.tr
                      key={groupId}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200"
                    >
                      <td className="p-4">
                        <h3 className="font-semibold text-slate-900 mb-1">{en?.title}</h3>
                        <p className="text-sm text-slate-600 line-clamp-1">{en?.excerpt}</p>
                      </td>
                      <td className="p-4 text-sm text-slate-600">{locs}</td>
                      <td className="p-4 text-sm text-slate-600">
                        {en?.created_at ? new Date(en.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => loadGroup(rows)}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void deleteGroup(groupId)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No articles yet</h3>
            <p className="text-slate-600 mb-4">Create an article with all three languages.</p>
            <button
              type="button"
              onClick={() => {
                resetForm()
                setShowForm(true)
              }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              New article
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArticleManager
