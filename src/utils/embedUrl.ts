/** Convert YouTube/Vimeo watch URLs to embed URLs for iframes. */
export function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url.trim())
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://www.youtube-nocookie.com/embed/${u.searchParams.get('v')}`
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube-nocookie.com/embed/${u.pathname.replace(/^\//, '')}`
    }
    if (u.hostname.includes('youtube.com') && u.pathname.startsWith('/embed/')) {
      return url.trim()
    }
    if (u.hostname.includes('vimeo.com')) {
      const parts = u.pathname.split('/').filter(Boolean)
      const id = parts[parts.length - 1]
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`
    }
    return url.trim()
  } catch {
    return null
  }
}
