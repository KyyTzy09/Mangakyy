// import type { Chapter, ChapterList } from "../interfaces"

// export interface ChapterHistory {
//     manga_cover_url: string
//     manga_title: string
//     mangaId: string
//     chapterId: string
//     chapterNumber: number
//     lastReadAt: Date
// }

// export function saveChapterHistory(data: {
//     mangaId: string
//     chapterId: string
//     chapterNumber: number
//     manga_cover_url: string
//     manga_title: string
// }) {
//     const key = "chapter_history"

//     const existing: ChapterHistory[] =
//         JSON.parse(localStorage.getItem(key) || "[]")

//     const filtered = existing.filter(
//         (item) => item.mangaId !== data.mangaId
//     )

//     const newHistory: ChapterHistory = {
//         ...data,
//         lastReadAt: new Date()
//     }

//     const updated = [newHistory, ...filtered]

//     localStorage.setItem(key, JSON.stringify(updated))
// }

// export function getChapterHistory(): ChapterHistory[] {
//     if (typeof window === "undefined") return []
//     const history = localStorage.getItem("chapter_history")
//     return history ? JSON.parse(history) : []
// }

export interface NewChapterHistory {
    chapter_id: string
    chapter_number: number
    thumbnail_image_url: string
    last_read_at: Date
    progress?: number // 0 to 100%
}
export interface NewComicHistory {
    comic_id: string
    comic_title: string
    comic_cover_url: string
    chapters: NewChapterHistory[]
    last_read_at: Date
    last_read_progress?: number // 0 to 100%
}

const KEY = "histories"

export function getNewChapterHistories(): NewComicHistory[] {
    if (typeof window === "undefined") return []

    const histories = localStorage.getItem(KEY)
    if (!histories) return []
    try {
        const parsed: NewComicHistory[] = JSON.parse(histories)
        return parsed.sort((a, b) => new Date(b.last_read_at).getTime() - new Date(a.last_read_at).getTime())
    } catch {
        return []
    }
}

export function clearNewChapterHistories() {
    localStorage.removeItem(KEY)
    return
}

export function getHistoryByComicId(comicId: string): NewComicHistory | null {
    const histories = getNewChapterHistories()
    const history = histories.find(
        (item) => item.comic_id === comicId
    )

    return history || null
}

export function saveNewComicHistory(
    comic: Omit<NewComicHistory, "chapters" | "last_read_at">,
    chapter: NewChapterHistory
) {
    const histories = getNewChapterHistories()

    const index = histories.findIndex(
        (item) => item.comic_id === comic.comic_id
    )

    const now = new Date()

    // manga belum ada di history
    if (index === -1) {
        const newHistory: NewComicHistory = {
            ...comic,
            chapters: [
                {
                    ...chapter,
                    last_read_at: now,
                },
            ],
            last_read_at: now,
        }

        histories.unshift(newHistory)
        localStorage.setItem(KEY, JSON.stringify(histories))
        return
    }

    const history = histories[index]

    const chapterIndex = history.chapters.findIndex(
        (c) => c.chapter_id === chapter.chapter_id
    )

    // kalau chapter baru
    if (chapterIndex === -1) {
        history.chapters.unshift({
            ...chapter,
            last_read_at: now,
        })
    } else {
        // kalau chapter sudah ada → update waktu baca dan pindahkan ke paling depan
        const updatedChapter: NewChapterHistory = {
            ...history.chapters[chapterIndex],
            ...chapter,
            progress: chapter.progress ?? history.chapters[chapterIndex].progress ?? 0,
            last_read_at: now,
        }
        history.chapters.splice(chapterIndex, 1)
        history.chapters.unshift(updatedChapter)
    }

    // update waktu terakhir baca manga
    history.last_read_at = now
    history.last_read_progress = chapter.progress ?? history.last_read_progress ?? 0

    // Pindahkan ke paling awal daftar agar manga yang baru dibaca selalu di atas
    histories.splice(index, 1)
    histories.unshift(history)

    localStorage.setItem(KEY, JSON.stringify(histories))
}

export function updateChapterProgress(
    comicId: string,
    chapterId: string,
    progress: number
): void {
    if (typeof window === "undefined") return

    const histories = getNewChapterHistories()
    const index = histories.findIndex((item) => item.comic_id === comicId)
    if (index === -1) return

    const comicHistory = histories[index]
    const chapterIndex = comicHistory.chapters.findIndex((c) => c.chapter_id === chapterId)
    if (chapterIndex === -1) return

    const rounded = Math.min(100, Math.max(0, Math.round(progress)))
    const now = new Date()

    comicHistory.chapters[chapterIndex].progress = rounded
    comicHistory.chapters[chapterIndex].last_read_at = now
    comicHistory.last_read_at = now
    comicHistory.last_read_progress = rounded

    histories.splice(index, 1)
    histories.unshift(comicHistory)

    localStorage.setItem(KEY, JSON.stringify(histories))
}

export function getLatestChapterHistory(comicId: string): NewChapterHistory | null {
    const histories = getNewChapterHistories()

    const history = histories.find(
        (item) => item.comic_id === comicId
    )

    if (!history || history.chapters.length === 0) return null

    // Kembalikan chapter dengan waktu last_read_at paling baru
    const sorted = [...history.chapters].sort((a, b) => {
        return new Date(b.last_read_at).getTime() - new Date(a.last_read_at).getTime()
    })

    return sorted[0] || null
}