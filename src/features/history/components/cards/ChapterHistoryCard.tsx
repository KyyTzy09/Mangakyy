import { defaultImage } from '@/shared/dummy/image'
import { formatRelativeTime } from '@/shared/utils/dateConverter'
import { saveNewComicHistory   } from '@/shared/utils/history'
import type {NewChapterHistory, NewComicHistory} from '@/shared/utils/history';
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
                saveNewComicHistory(
                    {
                        comic_cover_url: history.comic_cover_url,
                        comic_id: history.comic_id,
                        comic_title: history.comic_title,
                    },
                    {
                        chapter_id: chapter.chapter_id,
                        chapter_number: chapter.chapter_number,
                        thumbnail_image_url: chapter.thumbnail_image_url,
                        last_read_at: new Date(),
                        progress: chapter.progress,
                    }
                )
                navigate({ to: '/chapter/$chapterId', params: { chapterId: chapter.chapter_id } })
            }}
            className="group flex items-center justify-between w-full bg-slate-800 hover:bg-slate-700 transition p-4 rounded-xl mb-2 cursor-pointer">
            <div className="flex gap-4 items-center">
                <img
                    src={chapter.thumbnail_image_url || defaultImage}
                    alt={`Thumbnail Chapter ${chapter?.chapter_number || ''}`}
                    loading="lazy"
                    decoding="async"
                    className="flex items-center justify-center w-auto h-14 rounded-lg object-cover bg-gray-600"
                />
                <div>
                    <div className="font-medium text-white group-hover:text-primary transition-colors">
                        Chapter {chapter?.chapter_number}
                    </div>
                    <div className="text-sm text-slate-400">
                        {formatRelativeTime(new Date(chapter.last_read_at), true)}
                    </div>
                </div>
            </div>
            {chapter.progress !== undefined && chapter.progress > 0 && (
                <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                    <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 rounded-md">
                        {chapter.progress}%
                    </span>
                    <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${chapter.progress}%` }}
                        />
                    </div>
                </div>
            )}
        </motion.article>
    )
}
