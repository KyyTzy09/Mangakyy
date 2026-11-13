import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { ComicType, PopularComic } from '@/shared/interfaces'
import { cleanText } from '@/shared/utils/cleaner'
import { countryCodeToFlag, displayComicType } from '@/shared/utils/countryConverter'
import { formatCompactNumber } from '@/shared/utils/formater'
import { useNavigate } from '@tanstack/react-router'
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Info,
  BookOpen,
} from 'lucide-react'

export type CarouselItem = ComicType | PopularComic

interface Props {
  items?: CarouselItem[]
  recommendations?: CarouselItem[]
}
export default function CarouselSection({ items, recommendations }: Props) {
  const rawList = items || recommendations || []
  const list = rawList.slice(0, 10)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const navigate = useNavigate()
  const total = list.length

  const handlePrev = useCallback(() => {
    setIsDetailOpen(false)
    setSelectedIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  const handleNext = useCallback(() => {
    setIsDetailOpen(false)
    setSelectedIndex((prev) => (prev + 1) % total)
  }, [total])

  const handleSelect = (index: number) => {
    if (index === selectedIndex) return
    setIsDetailOpen(false)
    setSelectedIndex(index)
  }

  // Autoplay (pauses on hover or when detail is open)
  useEffect(() => {
    if (total <= 1 || isPaused || isDetailOpen) return

    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % total)
    }, 5500)

    return () => clearInterval(interval)
  }, [total, isPaused, isDetailOpen])

  if (!list || total === 0) {
    return null
  }

  const activeComic = list[selectedIndex]

  // Slot offsets: -2, -1, 0 (center active), 1, 2
  const slots = [-2, -1, 0, 1, 2]

  return (
    <section
      className="relative w-full overflow-hidden isolate pt-18 md:pt-22 pb-10 border-b border-white/5 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. Ambient Background Artwork (Full-width, slightly blurred for atmosphere) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence initial={false}>
          <motion.img
            key={activeComic.manga_id}
            src={activeComic.cover_image_url || activeComic.cover_portrait_url}
            alt={activeComic.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover filter blur-[3px] scale-105 transform-gpu will-change-transform"
          />
        </AnimatePresence>
        {/* Soft dark overlays ensuring cards and text stay the focal point */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080C14]/60 via-[#080C14]/25 to-[#080C14]" />
      </div>

      {/* 2. Floating Previous & Next Navigation Controls */}
      <button
        onClick={handlePrev}
        type="button"
        aria-label="Sebelumnya"
        className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-primary text-white/80 hover:text-white backdrop-blur-md border border-white/10 hover:border-primary/50 shadow-2xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={handleNext}
        type="button"
        aria-label="Selanjutnya"
        className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-primary text-white/80 hover:text-white backdrop-blur-md border border-white/10 hover:border-primary/50 shadow-2xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* 3. Game Card Selection Showcase */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 flex items-center justify-center min-h-[380px] sm:min-h-[420px] md:min-h-[460px]">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            const swipeThreshold = 40
            const velocityThreshold = 300
            if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
              handleNext()
            } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
              handlePrev()
            }
          }}
          className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 w-full cursor-grab active:cursor-grabbing touch-pan-y"
        >
          {slots.map((offset) => {
            const itemIndex = (selectedIndex + offset + total) % total
            const comic = list[itemIndex]
            if (!comic) return null

            const isCenter = offset === 0
            const isNear = Math.abs(offset) === 1
            const isFar = Math.abs(offset) === 2

            return (
              <motion.div
                key={comic.manga_id}
                layout
                initial={false}
                animate={{
                  scale: isCenter ? 1.08 : isNear ? 0.95 : 0.88,
                  opacity: isCenter ? 1 : isNear ? 0.75 : 0.45,
                }}
                transition={{
                  layout: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
                  scale: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
                  opacity: { duration: 0.3, ease: 'easeOut' },
                }}
                onClick={() => handleSelect(itemIndex)}
                className={`
                  relative rounded-2xl overflow-hidden shrink-0 cursor-pointer
                  transition-shadow duration-300 transform-gpu
                  ${
                    isCenter
                      ? 'w-[240px] sm:w-[280px] md:w-[310px] aspect-[3/4.3] z-20 ring-2 ring-primary shadow-[0_20px_50px_-10px_rgba(37,99,235,0.55)] border border-primary/50'
                      : ''
                  }
                  ${
                    isNear
                      ? 'w-[160px] sm:w-[190px] md:w-[220px] aspect-[3/4.3] z-10 border border-white/10 hover:opacity-95 hidden sm:block'
                      : ''
                  }
                  ${
                    isFar
                      ? 'w-[130px] sm:w-[160px] md:w-[180px] aspect-[3/4.3] z-0 border border-white/5 hover:opacity-80 hidden lg:block'
                      : ''
                  }
                `}
              >
                {/* Poster Artwork */}
                <img
                  src={comic.cover_portrait_url || comic.cover_image_url}
                  alt={comic.title}
                  loading={isCenter ? 'eager' : 'lazy'}
                  fetchPriority={isCenter ? 'high' : 'low'}
                  decoding="async"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />

                {/* Ambient Scrim Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/15 pointer-events-none" />

                {/* Badges on Top */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                  {/* Rating Badge */}
                  {isCenter ? (
                    <span className="bg-amber-400 text-slate-950 font-black text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md shadow-amber-400/20">
                      <Star className="w-3 h-3 fill-slate-950 text-slate-950" />
                      {comic.user_rate || 0}
                    </span>
                  ) : (
                    <span className="bg-black/60 backdrop-blur-md text-amber-400 text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 border border-white/10">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      {comic.user_rate || 0}
                    </span>
                  )}

                  {/* Country Flag Badge */}
                  <span className="bg-black/65 backdrop-blur-md px-1.5 py-0.5 rounded text-[12px] border border-white/15">
                    {countryCodeToFlag(comic.country_id)}
                  </span>
                </div>

                {/* Bottom Card Info (When Detail is NOT open) */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 flex flex-col gap-1.5">
                  {isCenter && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-sky-300 uppercase tracking-widest bg-sky-950/80 px-2 py-0.5 rounded border border-sky-400/20">
                        {displayComicType(comic.country_id)}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-400/20">
                        Ch. {comic.latest_chapter_number || '?'}
                      </span>
                    </div>
                  )}

                  <h3
                    className={`font-heading font-bold text-white line-clamp-1 ${
                      isCenter ? 'text-sm sm:text-base drop-shadow-md' : 'text-xs sm:text-sm'
                    }`}
                  >
                    {comic.title}
                  </h3>

                  {/* Center Card Action: "Lihat Detail" Button */}
                  {isCenter && !isDetailOpen && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsDetailOpen(true)
                      }}
                      className="mt-1 w-full bg-white/15 hover:bg-primary text-white text-xs font-semibold py-1.5 px-3 rounded-lg border border-white/20 hover:border-primary/50 backdrop-blur-md flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" />
                      Lihat Detail
                    </button>
                  )}
                </div>

                {/* Interactive Detail Overlay Inside Selected Card */}
                <AnimatePresence>
                  {isCenter && isDetailOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute inset-0 bg-slate-950/95 backdrop-blur-md p-4 text-white flex flex-col justify-between z-30"
                    >
                      {/* Detail Header */}
                      <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{countryCodeToFlag(comic.country_id)}</span>
                          <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                            ★ {comic.user_rate || 0}
                          </span>
                        </div>
                      </div>

                      {/* Detail Body */}
                      <div className="flex flex-col gap-2 my-auto overflow-hidden">
                        <h4 className="text-base sm:text-lg font-bold text-white line-clamp-2 leading-snug font-heading">
                          {comic.title}
                        </h4>

                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-medium">
                            Ch. {comic.latest_chapter_number || '?'}
                          </span>
                          <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                            {comic.status === 1 ? 'Ongoing' : 'Completed'}
                          </span>
                        </div>

                        {/* Meta Tags / Year / Genres */}
                        <div className="flex flex-wrap gap-1 max-h-14 overflow-hidden">
                          {comic.release_year && (
                            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium border border-white/5">
                              {comic.release_year}
                            </span>
                          )}
                          {comic.view_count > 0 && (
                            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium border border-white/5">
                              {formatCompactNumber(comic.view_count)} views
                            </span>
                          )}
                          {'taxonomy' in comic &&
                            comic.taxonomy?.Genre &&
                            comic.taxonomy.Genre.slice(0, 3).map((g: { name: string; slug: string }) => (
                              <span
                                key={g.slug}
                                className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium border border-white/5"
                              >
                                {g.name}
                              </span>
                            ))}
                        </div>
                        {/* Synopsis */}
                        <p className="text-xs sm:text-sm text-slate-200 line-clamp-4 leading-relaxed">
                          {cleanText(comic.description) || 'Tidak ada sinopsis tersedia.'}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() =>
                            navigate({
                              to: '/detail/$mangaId',
                              params: { mangaId: comic.manga_id },
                            })
                          }
                          className="flex-1 bg-primary hover:bg-blue-600 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-primary/30 transition-all cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          Baca Sekarang
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsDetailOpen(false)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2 px-2.5 rounded-lg border border-white/10 transition-colors cursor-pointer"
                        >
                          Tutup
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* 4. Dots Indicators */}
      <div className="relative z-10 flex items-center justify-center gap-1.5 mt-2">
        {list.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSelect(i)}
            aria-label={`Pilih komik nomor ${i + 1}`}
            className={`
              h-1.5 rounded-full transition-all duration-300 cursor-pointer
              ${i === selectedIndex ? 'w-6 bg-primary' : 'w-1.5 bg-white/20 hover:bg-white/40'}
            `}
          />
        ))}
      </div>
    </section>
  )
}
