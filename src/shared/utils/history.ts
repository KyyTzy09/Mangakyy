export interface ChapterHistory {
    mangaId: string
    chapterId: string
    chapterNumber: number
    lastReadAt: Date
}

export function saveChapterHistory(data: {
    mangaId: string
    chapterId: string
    chapterNumber: number
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
    return JSON.parse(localStorage.getItem("chapter_history") || "[]")
}