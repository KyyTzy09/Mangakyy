import { memo } from 'react'
import { defaultImage } from '@/shared/dummy/image'
import type { ChapterList, ComicType } from '@/shared/interfaces'
import { formatRelativeTime } from '@/shared/utils/dateConverter'
import { saveNewComicHistory } from '@/shared/utils/history'
import { useNavigate } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import { motion } from 'motion/react'

interface Props {
  index: number
  chapter: ChapterList
  comic: ComicType
  isLastRead?: boolean
  isRead?: boolean
}

function ChapterGridCard({
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
      className={`group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none shadow-sm hover:shadow-md ${
        isLastRead
          ? 'bg-primary/20 border-primary/60 shadow-primary/20 hover:bg-primary/25'
          : isRead
            ? 'bg-primary/10 border-primary/30 hover:bg-primary/15 hover:border-primary/50'
            : 'bg-[#0e1422]/75 hover:bg-[#141b2c]/90 border-white/5 hover:border-primary/40 backdrop-blur-xs'
      }`}
    >
      {/* Left: Thumbnail & Chapter Info */}
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

        {/* Text Details */}
        <div className="flex flex-col gap-1 min-w-0">
          <div
            className={`font-bold text-sm sm:text-base leading-snug truncate transition-colors ${
              isLastRead
                ? 'text-primary'
                : isRead
                  ? 'text-primary/90 group-hover:text-primary'
                  : 'text-white group-hover:text-primary'
            }`}
          >
            Chapter {chapter.chapter_number}
          </div>
          <div className="text-xs text-slate-400">
            {formatRelativeTime(new Date(chapter.release_date), true)}
          </div>
        </div>
      </div>

      {/* Right: Badge Dibaca atau Icon Play */}
      <div className="shrink-0 ml-2.5">
        {isLastRead ? (
          <span className="text-[10px] sm:text-[11px] bg-primary text-white font-bold px-2 py-1 rounded-lg shadow-sm">
            Terakhir Dibaca
          </span>
        ) : isRead ? (
          <span className="text-[10px] sm:text-[11px] bg-primary/20 border border-primary/40 text-primary font-semibold px-2 py-1 rounded-lg">
            Sudah Dibaca
          </span>
        ) : (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/5 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all">
            <Play className="w-4 h-4 fill-current ml-0.5 text-slate-400 group-hover:text-white transition-colors" />
          </div>
        )}
      </div>
    </motion.article>
  )
}

export default memo(ChapterGridCard)
