import React, { useState, useEffect } from 'react'
import { Calendar, User, Clock, ArrowRight, Plus, Search, ExternalLink } from 'lucide-react'
import { supabase, Article } from '../lib/supabase'

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

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
        console.error('Error fetching articles:', error)
        // For demo purposes, use mock data if Supabase is not connected
        setArticles(mockArticles)
      } else {
        setArticles(data || mockArticles)
      }
    } catch (error) {
      console.error('Error:', error)
      setArticles(mockArticles)
    } finally {
      setLoading(false)
    }
  }

  // Mock articles for demo
  const mockArticles: Article[] = [
    {
      id: '1',
      title: 'The Future of Renewable Energy in Kurdistan',
      excerpt: 'Exploring the potential of solar and wind energy solutions for sustainable development in the region.',
      content: '',
      author: 'Miran Safiny',
      published_at: '2024-01-15',
      created_at: '2024-01-15',
      slug: 'future-renewable-energy-kurdistan',
      image_url: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg',
      tags: ['Renewable Energy', 'Kurdistan', 'Sustainability']
    },
    {
      id: '2',
      title: 'Real Estate Market Trends in Erbil 2024',
      excerpt: 'Analysis of current market conditions and future opportunities in Erbils property sector.',
      content: '',
      author: 'Miran Safiny',
      published_at: '2024-01-10',
      created_at: '2024-01-10',
      slug: 'real-estate-trends-erbil-2024',
      image_url: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg',
      tags: ['Real Estate', 'Erbil', 'Market Analysis']
    },
    {
      id: '3',
      title: 'Digital Marketing Strategies for Local Businesses',
      excerpt: 'How Kurdistan businesses can leverage digital channels to reach wider audiences and drive growth.',
      content: '',
      author: 'Miran Safiny',
      published_at: '2024-01-05',
      created_at: '2024-01-05',
      slug: 'digital-marketing-local-businesses',
      image_url: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg',
      tags: ['Digital Marketing', 'Business Growth', 'Strategy']
    }
  ]

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openArticle = (article: Article) => {
    // Create a modal or navigate to article detail page
    alert(`Opening article: ${article.title}\n\nThis would typically open the full article content in a modal or navigate to a dedicated article page.`)
  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <section id="articles" className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading articles...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="articles" className="py-20 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Latest Articles</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-8"></div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Insights, analysis, and perspectives on business, technology, and regional development.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredArticles.map((article) => (
            <article 
              key={article.id} 
              className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 cursor-pointer transform hover:scale-105"
              onClick={() => openArticle(article)}
            >
              <div className="h-48 bg-slate-200 overflow-hidden">
                {article.image_url ? (
                  <img 
                    src={article.image_url} 
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-400 to-slate-600 flex items-center justify-center">
                    <span className="text-white text-lg font-medium">Article</span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-sm text-slate-500 mb-3">
                  <User className="h-4 w-4 mr-1" />
                  <span className="mr-4">{article.author}</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(article.published_at)}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-slate-900 mb-3 line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-slate-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                {article.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
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
                  className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200"
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
            <p className="text-slate-600 text-lg">No articles found matching your search.</p>
          </div>
        )}

        {/* Admin Note */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 text-center">
          <Plus className="h-8 w-8 text-amber-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">Content Management</h3>
          <p className="text-slate-300">
            Articles can be managed through the Supabase dashboard. Connect to Supabase to enable full article management functionality.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Articles