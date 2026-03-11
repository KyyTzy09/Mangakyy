import { defaultImage } from '@/shared/dummy/image'
import type { Chapter, ChapterList, ComicType } from '@/shared/interfaces'
import { Button } from '@/shared/shadcn/button'
import { formatRelativeTime } from '@/shared/utils/dateConverter'
import { saveNewComicHistory } from '@/shared/utils/history'
import { useNavigate } from '@tanstack/react-router'
import { motion } from 'motion/react'

interface Props {
    index: number
    chapter: ChapterList
    comic: ComicType
}

export default function ChapterList({ chapter, index, comic }: Props) {
    const navigate = useNavigate()
    return (
        <motion.article
            initial={{ translateY: 10 }}
            animate={{ translateY: 0 }}
            exit={{ translateY: 10 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => {
                navigate({ to: `/chapter/$chapterId`, params: { chapterId: chapter.chapter_id } })
                saveNewComicHistory({ comic_cover_url: comic.cover_image_url, comic_id: comic.manga_id, comic_title: comic.title }, { chapter_id: chapter.chapter_id, chapter_number: chapter.chapter_number, thumbnail_image_url: chapter.thumbnail_image_url, last_read_at: new Date() })
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
                        {formatRelativeTime(new Date(chapter.release_date), true)}
                    </div>
                </div>
            </div>

            <Button className="text-slate-400 group-hover:text-white hover:bg-blue-400">
                Baca
            </Button>
        </motion.article>
    )
}
