import type { UpdateComic } from '@/shared/interfaces'
import { formatRelativeTime } from '@/shared/utils/dateConverter'
import { useNavigate } from '@tanstack/react-router'
import { motion } from 'motion/react'

interface Props {
  data: UpdateComic
  index?: number
}

export default function LatestCard({ data, index = 0 }: Props) {
  const navigate = useNavigate()
  const {
    manga_id,
    title,
    cover_image_url,
    cover_portrait_url,
    chapters,
    latest_chapter_id,
    latest_chapter_number,
    updated_at,
  } = data

  const cover = cover_portrait_url || cover_image_url

  // Prepare up to 3 latest chapters
  const displayChapters =
    chapters && chapters.length > 0
      ? chapters.slice(0, 3)
      : latest_chapter_id
        ? [
            {
              chapter_id: latest_chapter_id,
              chapter_number: latest_chapter_number,
              created_at: updated_at,
            },
          ]
        : []

  const handleGoToDetail = () => {
    navigate({
      to: '/detail/$mangaId',
      params: { mangaId: manga_id },
    })
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="group flex gap-3.5 p-3 sm:p-3.5 rounded-2xl bg-[#0e1422] border border-white/5 hover:border-primary/40 transition-all duration-300 w-full shadow-sm hover:shadow-md"
    >
      {/* Cover Kiri */}
      <div
        onClick={handleGoToDetail}
        className="relative w-24 sm:w-28 aspect-[3/4.2] rounded-xl overflow-hidden shrink-0 cursor-pointer bg-slate-900 border border-white/5 group-hover:opacity-90 transition-opacity"
      >
        <img
          src={cover}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Konten Kanan */}
      <div className="flex flex-col flex-1 min-w-0 justify-between py-0.5">
        {/* Judul Komik */}
        <h3
          onClick={handleGoToDetail}
          className="font-bold text-sm sm:text-base text-white line-clamp-2 leading-snug hover:text-primary transition-colors cursor-pointer"
          title={title}
        >
          {title}
        </h3>

        {/* 3 Shortcut Chapter Buttons */}
        <div className="flex flex-col gap-1.5 mt-2">
          {displayChapters.map((ch) => (
            <button
              key={ch.chapter_id}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                navigate({
                  to: '/chapter/$chapterId',
                  params: { chapterId: ch.chapter_id },
                })
              }}
              className="w-full bg-[#182030]/80 hover:bg-primary/25 border border-white/5 hover:border-primary/40 rounded-lg px-3 py-2 flex items-center justify-between text-xs sm:text-sm transition cursor-pointer"
            >
              <span className="font-semibold text-slate-100">
                Ch. {ch.chapter_number}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-400">
                {formatRelativeTime(ch.created_at)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.article>
  )
}
