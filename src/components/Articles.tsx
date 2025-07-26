import React, { useState, useEffect } from 'react'
import { Calendar, User, Search, ExternalLink, Plus } from 'lucide-react'
import { supabase, Article } from '../lib/supabase' // Reverted to original import
import { useNavigate } from 'react-router-dom' // Reverted to original import

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate() // Reverted to original usage

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(6)

      if (error) {
        console.error('Supabase fetch error:', error.message)
        // Removed mockArticles fallback, in a real app you might handle this differently
        setArticles([]); // Set to empty array on error if no fallback is desired
      } else {
        setArticles(data || []) // Ensure data is an array
      }
    } catch (error) {
      console.error('Unexpected error fetching articles:', error)
      // Removed mockArticles fallback
      setArticles([]); // Set to empty array on unexpected error
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openArticle = (article: Article) => {
    // Reverted to original navigation logic
    navigate(`/articles/${article.slug}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      // Updated loading section background and text colors
      <section id="articles" className="py-20 bg-[#100C0D] text-[#E3DCD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Updated spinner color */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CC8B65] mx-auto"></div>
          <p className="mt-4 text-[#E3DCD2]">Loading articles...</p>
        </div>
      </section>
    )
  }

  return (
    // Updated section background to match the dark theme
    <section id="articles" className="py-20 bg-[#100C0D] text-[#E3DCD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* Updated heading text color */}
          <h2 className="text-4xl font-bold text-[#E3DCD2] mb-4">Latest Articles</h2>
          {/* Updated divider color to accent */}
          <div className="w-24 h-1 bg-[#CC8B65] mx-auto mb-8"></div>
          {/* Updated paragraph text color */}
          <p className="text-lg text-[#E3DCD2]/80 max-w-2xl mx-auto">
            Insights, analysis, and perspectives on business, technology, and regional development.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            {/* Updated search icon color */}
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#E3DCD2]/60" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // Updated input field styling for dark theme
              className="w-full pl-10 pr-4 py-3 border border-[#013328] rounded-lg focus:ring-2 focus:ring-[#CC8B65] focus:border-[#CC8B65] bg-[#013328] text-[#E3DCD2] shadow-sm placeholder-[#E3DCD2]/50"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              // Updated article card background, shadow, and border for dark theme
              className="bg-[#013328] rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#CC8B65]/30 cursor-pointer transform hover:scale-105"
              onClick={() => openArticle(article)}
            >
              <div className="h-48 bg-[#013328] overflow-hidden">
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    // Fallback for image loading errors
                    onError={(e) => {
                      e.currentTarget.onerror = null; // Prevent infinite loop
                      e.currentTarget.src = `https://placehold.co/600x400/CC8B65/100C0D?text=Article`;
                    }}
                  />
                ) : (
                  // Updated placeholder background for dark theme
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
                      // Updated tag styling for dark theme
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
                  // Updated "Read More" button color for dark theme
                  className="inline-flex items-center text-[#CC8B65] hover:text-[#CC8B65]/80 font-medium transition-colors duration-200"
                >
                  Read More
                  <ExternalLink className="ml-2 h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            {/* Updated "No articles found" text color */}
            <p className="text-[#E3DCD2]/70 text-lg">No articles found matching your search.</p>
          </div>
        )}

        {/* Admin Note */}

      </div>
    </section>
  )
}

export default Articles
