export interface ChapterHistory {
    manga_cover_url: string
    manga_title: string
    mangaId: string
    chapterId: string
    chapterNumber: number
    lastReadAt: Date
}

export function saveChapterHistory(data: {
    mangaId: string
    chapterId: string
    chapterNumber: number
    manga_cover_url: string
    manga_title: string
}) {
    const key = "chapter_history"

    const existing: ChapterHistory[] =
        JSON.parse(localStorage.getItem(key) || "[]")

    const filtered = existing.filter(
        (item) => item.mangaId !== data.mangaId
    )

    const newHistory: ChapterHistory = {
        ...data,
        lastReadAt: new Date()
    }

    const updated = [newHistory, ...filtered]

    localStorage.setItem(key, JSON.stringify(updated))
}

export function getChapterHistory(): ChapterHistory[] {
    if (typeof window === "undefined") return []
    const history = localStorage.getItem("chapter_history")
    return history ? JSON.parse(history) : []
}