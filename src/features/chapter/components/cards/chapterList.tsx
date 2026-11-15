import { defaultImage } from '@/shared/dummy/image'
import type { ChapterList as ChapterListType, ComicType } from '@/shared/interfaces'
import { Button } from '@/shared/shadcn/button'
import { formatRelativeTime } from '@/shared/utils/dateConverter'
import { saveNewComicHistory } from '@/shared/utils/history'
import { useNavigate } from '@tanstack/react-router'
import { motion } from 'motion/react'

interface Props {
  index: number
  chapter: ChapterListType
  comic: ComicType
  isLastRead?: boolean
  isRead?: boolean
}

export default function ChapterList({
  chapter,
  index,
  comic,
  isLastRead = false,
  isRead = false,
}: Props) {
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate({
      to: '/chapter/$chapterId',
      params: { chapterId: chapter.chapter_id },
    })
    saveNewComicHistory(
      {
        comic_cover_url: comic.cover_image_url,
        comic_id: comic.manga_id,
        comic_title: comic.title,
      },
      {
        chapter_id: chapter.chapter_id,
        chapter_number: chapter.chapter_number,
        thumbnail_image_url: chapter.thumbnail_image_url || defaultImage,
        last_read_at: new Date(),
      },
    )
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.25) }}
      onClick={handleNavigate}
      className={`group flex items-center justify-between w-full p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none mb-2.5 shadow-sm hover:shadow-md ${
        isLastRead
          ? 'bg-primary/20 border-primary/60 shadow-primary/20 hover:bg-primary/25'
          : isRead
            ? 'bg-primary/10 border-primary/30 hover:bg-primary/15 hover:border-primary/40'
            : 'bg-[#0e1422]/75 hover:bg-[#141b2c]/90 border-white/5 hover:border-primary/30 backdrop-blur-xs'
      }`}
    >
      <div className="flex gap-3.5 sm:gap-4 items-center min-w-0">
        {/* Generous Image Preview */}
        <div className="w-20 sm:w-24 md:w-26 h-15 sm:h-17 shrink-0 rounded-xl overflow-hidden bg-slate-800 border border-white/10 shadow-inner">
          <img
            src={chapter.thumbnail_image_url || defaultImage}
            alt={chapter.chapter_title || `Ch. ${chapter.chapter_number}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <div
            className={`font-bold text-base sm:text-lg leading-snug truncate transition-colors ${
              isLastRead
                ? 'text-primary'
                : isRead
                  ? 'text-primary/90 group-hover:text-primary'
                  : 'text-white group-hover:text-primary'
            }`}
          >
            Chapter {chapter.chapter_number}
          </div>
          <div className="text-xs sm:text-sm text-slate-400">
            {formatRelativeTime(new Date(chapter.release_date), true)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-2">
        {isLastRead ? (
          <span className="text-[10px] sm:text-xs bg-primary text-white font-bold px-2 sm:px-2.5 py-1 rounded-lg shadow-sm">
            Terakhir Dibaca
          </span>
        ) : isRead ? (
          <span className="text-[10px] sm:text-xs bg-primary/20 border border-primary/40 text-primary font-semibold px-2 sm:px-2.5 py-1 rounded-lg">
            Sudah Dibaca
          </span>
        ) : null}
        <Button
          size="sm"
          className="px-4 py-2 bg-white/5 group-hover:bg-primary group-hover:text-white border border-white/10 group-hover:border-primary text-slate-200 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm"
        >
          Baca
        </Button>
      </div>
    </motion.article>
  )
}
