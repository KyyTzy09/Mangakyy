import { motion } from 'motion/react'
import { Heart, BookOpen } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { H18ComicItem } from '../types'
import { getH18ImageUrl } from '../utils/imageUrl'

interface Props {
  data: H18ComicItem
  index?: number
}

export default function H18Card({ data, index = 0 }: Props) {
  const imageUrl = getH18ImageUrl(data.cover_url)

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.3 }}
      className="w-full"
    >
      <Link
        to="/h-detail/$id"
        params={{ id: String(data.id) }}
        className="group relative flex flex-col items-center justify-start w-full h-auto bg-[#110a16]/80 hover:bg-[#1a0f22] border border-white/10 hover:border-[#ff2d78] overflow-hidden rounded-xl gap-2 transition-all cursor-pointer shadow-sm hover:shadow-lg hover:shadow-[#ff2d78]/20"
      >
        {/* Cover Image Container */}
        <div className="relative w-full aspect-[3/4.2] overflow-hidden rounded-t-xl bg-slate-900">
          <img
            src={imageUrl}
            alt={data.title}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget
              if (data.cover_url && !target.src.includes(data.cover_url)) {
                target.src = data.cover_url
              }
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Top Badges */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none">
            <span className="bg-[#ff2d78] text-white text-[11px] font-black px-2 py-0.5 rounded shadow-md">
              18+
            </span>
          </div>

          {/* Top Right: Page Count */}
          <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-[11px] font-semibold text-slate-200 pointer-events-none">
            <BookOpen className="w-3 h-3 text-[#ff2d78]" />
            <span>{data.page_count}P</span>
          </div>

          {/* Bottom Scrim */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        </div>

        {/* Content Details */}
        <div className="flex flex-col w-full px-2.5 pb-3 gap-1.5">
          {/* Title */}
          <h3
            className="w-full text-white group-hover:text-[#ff2d78] font-bold text-xs sm:text-sm line-clamp-2 transition-colors leading-snug text-left"
            title={data.title}
          >
            {data.title}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1 overflow-hidden max-h-5 w-full">
            {data.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.name}
                className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5 group-hover:border-[#ff2d78]/30 transition-colors truncate max-w-[80px]"
              >
                #{tag.name}
              </span>
            ))}
          </div>

          {/* Footer Meta: Favorites */}
          <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1 border-t border-white/5 w-full">
            <span className="text-[10px] text-slate-400">ID: #{data.id}</span>
            <div className="flex items-center gap-1 text-[#ff2d78] font-semibold">
              <Heart className="w-3 h-3 fill-current" />
              <span>{data.favorite_count?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
