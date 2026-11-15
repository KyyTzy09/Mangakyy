export interface H18HistoryItem {
  id: number | string
  title: string
  japanese_title?: string
  media_id?: string
  cover_url: string
  thumbnail_url: string
  page_count: number
  read_at: string
  last_page?: number
}

const H18_HISTORY_KEY = 'mangakyy_h18_history'
const MAX_HISTORY_ITEMS = 100

export function getH18Histories(): H18HistoryItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(H18_HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.error('[H18History] Failed to read history:', err)
    return []
  }
}

export function saveH18History(
  item: Omit<H18HistoryItem, 'read_at'> & { last_page?: number }
): void {
  if (typeof window === 'undefined') return
  try {
    const existing = getH18Histories()
    const cleanId = String(item.id)

    // Filter out previous entry for same comic
    const filtered = existing.filter((h) => String(h.id) !== cleanId)

    const newEntry: H18HistoryItem = {
      ...item,
      read_at: new Date().toISOString(),
    }

    const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY_ITEMS)
    localStorage.setItem(H18_HISTORY_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('[H18History] Failed to save history:', err)
  }
}

export function removeH18History(id: number | string): void {
  if (typeof window === 'undefined') return
  try {
    const existing = getH18Histories()
    const cleanId = String(id)
    const updated = existing.filter((h) => String(h.id) !== cleanId)
    localStorage.setItem(H18_HISTORY_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('[H18History] Failed to remove history:', err)
  }
}

export function clearH18Histories(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(H18_HISTORY_KEY)
  } catch (err) {
    console.error('[H18History] Failed to clear history:', err)
  }
}
