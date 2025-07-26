import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase, Article } from '../lib/supabase' // adjust this path to your supabase.ts


const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<Article | null>(null)

  useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })

    async function fetchArticle() {
      if (!slug) return
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        console.error('Error fetching article:', error)
        setArticle(null); // Set to null on error
      } else {
        setArticle(data)
      }
    }
    fetchArticle()
  }, [slug])

  if (!article) {
    return (
      // Loading state with dark theme styling
      <div className="min-h-screen bg-[#100C0D] text-[#E3DCD2] flex items-center justify-center pt-[80px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CC8B65] mx-auto"></div>
        <p className="ml-4 text-lg">Loading article...</p>
      </div>
    );
  }

  return (
    // Article container with dark theme background and text colors
    // Changed pt-[80px] to mt-[80px] to ensure the article starts after the fixed header
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[#100C0D] text-[#E3DCD2] min-h-screen mt-[80px]">
      {/* Article title with updated color */}
      <h1 className="text-3xl font-bold mb-4 text-[#E3DCD2]">{article.title}</h1>
      {/* Author and date with updated color */}
      <p className="mb-4 text-[#E3DCD2]/70">
        By {article.author} on {new Date(article.published_at).toLocaleDateString()}
      </p>
      {article.image_url ? (
        <img
          src={article.image_url}
          alt={article.title}
          className="mb-6 rounded-lg w-full h-auto object-cover shadow-lg"
          onError={(e) => {
            e.currentTarget.onerror = null; // Prevent infinite loop
            e.currentTarget.src = `https://placehold.co/800x450/CC8B65/100C0D?text=Article+Image`;
          }}
        />
      ) : (
        // Placeholder image for articles without an image_url
        <div className="mb-6 rounded-lg w-full h-auto object-cover shadow-lg bg-gradient-to-br from-[#CC8B65] to-[#013328] flex items-center justify-center" style={{height: '450px'}}>
            <span className="text-[#100C0D] text-xl font-medium">No Image Available</span>
        </div>
      )}
      {/* Article content with updated text color for readability on dark background */}
      {/* Added !text-[#E3DCD2] to strongly enforce text color for content rendered via dangerouslySetInnerHTML */}
      <div className="prose prose-invert max-w-none !text-[#E3DCD2]" dangerouslySetInnerHTML={{ __html: article.content || '' }} />
    </article>
  )
}

export default ArticleDetail
