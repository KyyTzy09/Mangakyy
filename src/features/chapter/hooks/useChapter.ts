import type { ChapterDetail, ComicType } from "@/shared/interfaces";
import {
    saveNewComicHistory,
    updateChapterProgress,
    getHistoryByComicId,
} from "@/shared/utils/history";
import { useEffect, useRef } from "react";

interface Props {
    chapterId: string
    chapter: ChapterDetail
    comic: ComicType
}

export const useChapter = ({ chapterId, chapter, comic }: Props) => {
    const progressRef = useRef(0)
    const saveTimeoutRef = useRef<number | null>(null)

    // Initial save on mount / chapter change
    useEffect(() => {
        if (!chapter?.chapter_id || !comic?.manga_id) return

        const existingComic = getHistoryByComicId(comic.manga_id)
        const existingChapter = existingComic?.chapters.find(
            (c) => c.chapter_id === chapter.chapter_id
        )
        const initialProgress = existingChapter?.progress || 0
        progressRef.current = initialProgress

        saveNewComicHistory(
            {
                comic_cover_url: comic.cover_image_url || "",
                comic_id: comic.manga_id,
                comic_title: comic.title || "",
            },
            {
                chapter_id: chapter.chapter_id,
                chapter_number: chapter.chapter_number || 0,
                thumbnail_image_url: chapter.thumbnail_image_url || "",
                last_read_at: new Date(),
                progress: initialProgress,
            }
        )
    }, [chapterId, chapter, comic])

    // Track scroll progress and auto-record on scroll + on exit
    useEffect(() => {
        if (!chapter?.chapter_id || !comic?.manga_id) return

        const comicId = comic.manga_id
        const chId = chapter.chapter_id

        const handleScroll = () => {
            const totalHeight =
                document.documentElement.scrollHeight - window.innerHeight
            if (totalHeight > 0) {
                const current = Math.min(
                    100,
                    Math.max(0, (window.scrollY / totalHeight) * 100)
                )
                const rounded = Math.round(current)
                progressRef.current = rounded

                // Debounce save every 500ms
                if (saveTimeoutRef.current) {
                    window.clearTimeout(saveTimeoutRef.current)
                }
                saveTimeoutRef.current = window.setTimeout(() => {
                    updateChapterProgress(comicId, chId, rounded)
                }, 500)
            }
        }

        // Flush immediately when user exits, navigates away, or switches tabs
        const handleExit = () => {
            updateChapterProgress(comicId, chId, progressRef.current)
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        window.addEventListener("beforeunload", handleExit)
        window.addEventListener("pagehide", handleExit)
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                handleExit()
            }
        }
        document.addEventListener("visibilitychange", handleVisibilityChange)

        return () => {
            window.removeEventListener("scroll", handleScroll)
            window.removeEventListener("beforeunload", handleExit)
            window.removeEventListener("pagehide", handleExit)
            document.removeEventListener("visibilitychange", handleVisibilityChange)
            if (saveTimeoutRef.current) {
                window.clearTimeout(saveTimeoutRef.current)
            }
            handleExit()
        }
    }, [chapterId, chapter?.chapter_id, comic?.manga_id])
}