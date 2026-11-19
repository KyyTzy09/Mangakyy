import { memo } from 'react'
import type { ComicType } from '@/shared/interfaces'
import { formatCompactNumber } from '@/shared/utils/formater'
import { Link } from '@tanstack/react-router'
import { Eye, Star } from 'lucide-react'
import { motion } from 'motion/react'

interface Props {
  data: ComicType
  index?: number
}

function GenreComicCard({ data, index = 0 }: Props) {
  const cover = data.cover_portrait_url || data.cover_image_url

  return (
    <Link
      to="/detail/$mangaId"
      params={{ mangaId: data.manga_id }}
      className="group flex flex-col w-full gap-2 cursor-pointer select-none"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: index * 0.03 }}
        className="flex flex-col w-full gap-2"
      >
        {/* Cover Poster */}
        <div className="relative w-full aspect-[3/4.2] overflow-hidden rounded-xl bg-slate-900 border border-white/5 group-hover:border-primary/40 transition-all duration-300">
          <img
            src={cover}
            alt={data.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Scrim Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />

          {/* Top Right: Rating */}
          {data.user_rate > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-white/10 text-amber-300 text-[11px] font-bold">
              <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
              {data.user_rate.toFixed(1)}
            </div>
          )}

          {/* Bottom Info: Chapter & Views */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs text-slate-200 pointer-events-none">
            {data.latest_chapter_number ? (
              <span className="font-semibold text-white bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] border border-white/10">
                Ch. {data.latest_chapter_number}
              </span>
            ) : (
              <span />
            )}
            {data.view_count > 0 && (
              <span className="text-[10px] sm:text-[11px] text-slate-300 flex items-center gap-1 font-medium bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
                <Eye className="w-3 h-3 text-slate-400" />
                {formatCompactNumber(data.view_count)}
              </span>
            )}
          </div>
        </div>

        {/* Title Below Cover */}
        <h3
          className="font-semibold text-xs sm:text-sm text-white line-clamp-2 leading-snug group-hover:text-primary transition-colors"
          title={data.title}
        >
          {data.title}
        </h3>
      </motion.div>
    </Link>
  )
}

export default memo(GenreComicCard)
