import { defaultImage } from '@/shared/dummy/image'
import { formatRelativeTime } from '@/shared/utils/dateConverter'
import { saveNewComicHistory, type NewChapterHistory, type NewComicHistory } from '@/shared/utils/history'
import { useNavigate } from '@tanstack/react-router'
import { motion } from 'motion/react'
interface ChapterHistoryCardProps {
    history: NewComicHistory
    chapter: NewChapterHistory
    index: number
}

export default function ChapterHistoryCard({ history, chapter, index }: ChapterHistoryCardProps) {
    const navigate = useNavigate()

    return (
        <motion.article
            initial={{ translateY: 10 }}
            animate={{ translateY: 0 }}
            exit={{ translateY: 10 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => {
                saveNewComicHistory({ comic_cover_url: history.comic_cover_url, comic_id: history.comic_id, comic_title: history.comic_title }, { chapter_id: chapter.chapter_id, chapter_number: chapter.chapter_number, thumbnail_image_url: chapter.thumbnail_image_url, last_read_at: new Date() })
                navigate({ to: '/chapter/$chapterId', params: { chapterId: chapter.chapter_id } })
            }}
            className="group flex items-center justify-between w-full bg-slate-800 hover:bg-slate-700 transition p-4 rounded-xl mb-2 cursor-pointer">
            <div className="flex gap-4 items-center">
                <img
                    src={chapter.thumbnail_image_url || defaultImage}
                    alt={"No-image"}
                    className="flex items-center justify-center w-auto h-14 rounded-lg object-cover bg-gray-600"
                />
                <div>
                    <div className="font-medium">
                        Chapter {chapter?.chapter_number}
                    </div>
                    <div className="text-sm text-slate-400">
                        {formatRelativeTime(new Date(chapter.last_read_at), true)}
                    </div>
                </div>
            </div>
        </motion.article>
    )
}
