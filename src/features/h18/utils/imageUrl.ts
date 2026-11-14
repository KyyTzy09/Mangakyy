/**
 * Helper to route H18 images through the local proxy
 * to bypass ISP DNS hijacking (Internet Positif) and CDN hotlinking restrictions.
 */
export function getH18ImageUrl(url: string | undefined | null): string {
  if (!url) return ''
  if (
    url.startsWith('/api/h18/image') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url
  }
  return `/api/h18/image?url=${encodeURIComponent(url)}`
}
