import React, { useState, useEffect } from 'react'
import { Calendar, User, Search, ExternalLink } from 'lucide-react'
import { supabase, Article } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

// Define a SkeletonArticleCard component
const SkeletonArticleCard: React.FC = () => (
  <div className="bg-[#013328] rounded-xl shadow-lg overflow-hidden border border-[#CC8B65]/30 animate-pulse">
    <div className="h-48 bg-[#013328] flex items-center justify-center">
      <div className="w-24 h-24 bg-[#CC8B65]/30 rounded-full"></div>
    </div>
    <div className="p-6">
      <div className="flex items-center text-sm mb-3">
        <div className="h-4 w-16 bg-[#E3DCD2]/20 rounded mr-4"></div>
        <div className="h-4 w-24 bg-[#E3DCD2]/20 rounded"></div>
      </div>
      <div className="h-6 bg-[#E3DCD2]/30 rounded mb-3 w-3/4"></div>
      <div className="h-4 bg-[#E3DCD2]/20 rounded mb-2 w-full"></div>
      <div className="h-4 bg-[#E3DCD2]/20 rounded mb-4 w-5/6"></div>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="px-3 py-1 bg-[#CC8B65]/10 rounded-full w-16"></div>
        <div className="px-3 py-1 bg-[#CC8B65]/10 rounded-full w-20"></div>
      </div>
      <div className="h-5 bg-[#CC8B65]/30 rounded w-24"></div>
    </div>
  </div>
)

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(6)
  const [totalArticles, setTotalArticles] = useState(0)
  const { t } = useLanguage()

  const navigate = useNavigate()

  useEffect(() => {
    fetchArticles()
  }, [page, searchTerm]) // ADD searchTerm here!

  useEffect(() => {
    // When search term changes, reset page to 1.
    // The actual fetch will now be triggered by the `[page, searchTerm]` dependency.
    setPage(1)
  }, [searchTerm])

  const fetchArticles = async () => {
    try {
      setLoading(true) // Set loading true at the start of fetch
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      // Introduce a small delay to make the skeleton noticeable, remove in production if not desired
      await new Promise(resolve => setTimeout(resolve, 500));

      // Build the base query
      let query = supabase
        .from('articles')
        .select('*', { count: 'exact' }) // Request count explicitly
        .order('published_at', { ascending: false })
        .range(from, to);

      // Add search filter if searchTerm is not empty
      if (searchTerm) {
        // Use ilike for case-insensitive partial match on title or excerpt
        query = query.or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Supabase fetch error:', error.message)
        setArticles([])
        setTotalArticles(0) // Reset total count on error
      } else {
        setArticles(data || [])
        setTotalArticles(count || 0) // Use the count returned by the query
      }
    } catch (error) {
      console.error('Unexpected error fetching articles:', error)
      setArticles([])
      setTotalArticles(0)
    } finally {
      setLoading(false) // Set loading false after fetch completes
    }
  }

  const openArticle = (article: Article) => {
    navigate(`/articles/${article.slug}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <section id="articles" className="py-20 bg-[#100C0D] text-[#E3DCD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#E3DCD2] mb-4">{t('articles.title')}</h2>
          <div className="w-24 h-1 bg-[#CC8B65] mx-auto mb-8"></div>
          <p className="text-lg text-[#E3DCD2]/80 max-w-2xl mx-auto">
            {t('articles.description')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#E3DCD2]/60" />
            <input
              type="text"
              placeholder={t('articles.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#013328] rounded-lg focus:ring-2 focus:ring-[#CC8B65] focus:border-[#CC8B65] bg-[#013328] text-[#E3DCD2] shadow-sm placeholder-[#E3DCD2]/50"
            />
          </div>
        </div>

        {/* Articles Grid (or Skeletons) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading ? (
            // Render skeleton cards when loading
            Array.from({ length: pageSize }).map((_, index) => <SkeletonArticleCard key={index} />)
          ) : (
            // Render actual articles when not loading
            articles.length > 0 ? ( // Use `articles.length` directly here
              articles.map((article) => (
                <article
                  key={article.id}
                  className="bg-[#013328] rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#CC8B65]/30 cursor-pointer transform hover:scale-105"
                  onClick={() => openArticle(article)}
                >
                  <div className="h-48 bg-[#013328] overflow-hidden">
                    {article.image_url ? (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = `https://placehold.co/600x400/CC8B65/100C0D?text=Article`
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#CC8B65] to-[#013328] flex items-center justify-center">
                        <span className="text-[#100C0D] text-lg font-medium">Article</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center text-sm text-[#E3DCD2]/70 mb-3">
                      <User className="h-4 w-4 mr-1" />
                      <span className="mr-4">{article.author}</span>
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(article.published_at)}</span>
                    </div>

                    <h3 className="text-xl font-semibold text-[#E3DCD2] mb-3 line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-[#E3DCD2]/80 mb-4 line-clamp-3">{article.excerpt}</p>

                    {article.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-[#CC8B65]/20 text-[#CC8B65] text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openArticle(article)
                      }}
                      className="inline-flex items-center text-[#CC8B65] hover:text-[#CC8B65]/80 font-medium transition-colors duration-200"
                    >
                      {t('articles.readMore')}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))
            ) : (
              // Display "No articles found" only when not loading and articles array is empty
              <div className="text-center py-12 col-span-full">
                <p className="text-[#E3DCD2]/70 text-lg">{t('articles.noArticles')}</p>
              </div>
            )
          )}
        </div>

        {/* Pagination Controls */}
        {totalArticles > pageSize && ( // Only show pagination if there are more articles than can fit on one page
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1 || loading} // Disable if loading or on first page
              className="px-4 py-2 bg-[#013328] border border-[#CC8B65] text-[#CC8B65] rounded-lg hover:bg-[#CC8B65]/10 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-[#E3DCD2]/80">
              Page {page} of {Math.ceil(totalArticles / pageSize)}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page * pageSize >= totalArticles || loading} // Disable if loading or on last page
              className="px-4 py-2 bg-[#013328] border border-[#CC8B65] text-[#CC8B65] rounded-lg hover:bg-[#CC8B65]/10 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Articles