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
}
export interface NewComicHistory {
    comic_id: string
    comic_title: string
    comic_cover_url: string
    chapters: NewChapterHistory[]
    last_read_at: Date
}

const KEY = "histories"

export function getNewChapterHistories(): NewComicHistory[] {
    if (typeof window === "undefined") return []

    const histories = localStorage.getItem(KEY)
    return histories ? JSON.parse(histories) : []
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
        history.chapters.push({
            ...chapter,
            last_read_at: now,
        })
    } else {
        // kalau chapter sudah ada → update waktu baca
        history.chapters[chapterIndex].last_read_at = now
    }

    // update waktu terakhir baca manga
    history.last_read_at = now

    histories[index] = history

    localStorage.setItem(KEY, JSON.stringify(histories))
}

export function getLatestChapterHistory(comicId: string) {
    const histories = getNewChapterHistories()

    const history = histories.find(
        (item) => item.comic_id === comicId
    )

    if (!history || history.chapters.length === 0) return null

    return history.chapters[history.chapters.length - 1]
}