/** Ensure <img> tags have alt text for SEO/accessibility (Google recommends descriptive alts). */
export function ensureImgAltAttributes(html: string, fallbackAlt: string): string {
  if (typeof window === 'undefined' || !html) return html
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    doc.querySelectorAll('img').forEach((img) => {
      const alt = img.getAttribute('alt')
      if (!alt || !alt.trim()) {
        img.setAttribute('alt', fallbackAlt)
      }
    })
    return doc.body.innerHTML
  } catch {
    return html
  }
}
