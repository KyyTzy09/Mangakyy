/**
 * Cookie parsing & serialization helper
 */

export function getCookieFromHeader(name: string, cookieHeader?: string | null): string | null {
  if (!cookieHeader) return null
  const match = cookieHeader.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`))
  return match ? decodeURIComponent(match[3]) : null
}

export function getClientCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  return getCookieFromHeader(name, document.cookie)
}

export function serializeCookie(name: string, value: string, days = 30): string {
  const maxAge = days * 24 * 60 * 60
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`
}

export function setClientCookie(name: string, value: string, days = 30): void {
  if (typeof document === 'undefined') return
  document.cookie = serializeCookie(name, value, days)
}

export function deleteClientCookie(name: string): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`
}
