import { Navigate, useParams } from 'react-router-dom'

export function LegacyArticlesRedirect() {
  return <Navigate to="/en/articles" replace />
}

export function LegacyArticleDetailRedirect() {
  const { slug } = useParams<{ slug: string }>()
  if (!slug) return <Navigate to="/en/articles" replace />
  return <Navigate to={`/en/articles/${encodeURIComponent(slug)}`} replace />
}
