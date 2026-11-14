import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight, Heart, BookOpen } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import type { H18ComicItem } from '../types'
import { getH18ImageUrl } from '../utils/imageUrl'

interface Props {
  items: H18ComicItem[]
}

export default function H18Carousel({ items }: Props) {
  const list = items.slice(0, 8)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const navigate = useNavigate()
  const total = list.length

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % total)
  }, [total])

  const handleSelect = (index: number) => {
    if (index === selectedIndex) {
      // Click on center card goes to detail
      navigate({ to: '/h-detail/$id', params: { id: String(list[index].id) } })
      return
    }
    setSelectedIndex(index)
  }

  // Autoplay
  useEffect(() => {
    if (total <= 1 || isPaused) return
    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % total)
    }, 6000)
    return () => clearInterval(interval)
  }, [total, isPaused])

  if (!list || total === 0) return null

  const activeComic = list[selectedIndex]
  const slots = [-2, -1, 0, 1, 2]

  return (
    <section
      className="relative w-full overflow-hidden isolate pt-18 md:pt-22 pb-8 border-b border-white/5 select-none bg-[#09050d]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. Ambient Background Artwork */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence initial={false}>
          <motion.img
            key={activeComic.id}
            src={getH18ImageUrl(activeComic.cover_url)}
            alt={activeComic.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget
              if (activeComic.cover_url && !target.src.includes(activeComic.cover_url)) {
                target.src = activeComic.cover_url
              }
            }}
            className="absolute inset-0 w-full h-full object-cover filter blur-[4px] scale-105 transform-gpu will-change-transform"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-[#09050d]/70 via-[#09050d]/40 to-[#09050d]" />
      </div>

      {/* 2. Navigation Buttons */}
      <button
        onClick={handlePrev}
        type="button"
        aria-label="Sebelumnya"
        className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-[#ff2d78] text-white backdrop-blur-md border border-white/10 hover:border-[#ff2d78] shadow-2xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={handleNext}
        type="button"
        aria-label="Selanjutnya"
        className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-[#ff2d78] text-white backdrop-blur-md border border-white/10 hover:border-[#ff2d78] shadow-2xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* 3. Card Showcase */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 flex items-center justify-center min-h-[380px] sm:min-h-[420px] md:min-h-[460px]">
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 w-full">
          {slots.map((offset) => {
            const itemIndex = (selectedIndex + offset + total) % total
            const comic = list[itemIndex]
            if (!comic) return null

            const isCenter = offset === 0
            const isNear = Math.abs(offset) === 1
            const isFar = Math.abs(offset) === 2

            return (
              <motion.div
                key={comic.id}
                layout="position"
                initial={false}
                animate={{
                  scale: isCenter ? 1.08 : isNear ? 0.95 : 0.88,
                  opacity: isCenter ? 1 : isNear ? 0.75 : 0.45,
                }}
                transition={{
                  scale: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
                  opacity: { duration: 0.3, ease: 'easeOut' },
                }}
                onClick={() => handleSelect(itemIndex)}
                className={`
                  relative rounded-2xl overflow-hidden shrink-0 cursor-pointer
                  transition-shadow duration-300 transform-gpu
                  ${
                    isCenter
                      ? 'w-[240px] sm:w-[280px] md:w-[310px] aspect-[3/4.3] z-20 ring-2 ring-[#ff2d78] shadow-[0_20px_50px_-10px_rgba(255,45,120,0.55)] border border-[#ff2d78]'
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
                  src={getH18ImageUrl(comic.cover_url)}
                  alt={comic.title}
                  loading={isCenter ? 'eager' : 'lazy'}
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget
                    if (comic.cover_url && !target.src.includes(comic.cover_url)) {
                      target.src = comic.cover_url
                    }
                  }}
                  className="w-full h-full object-cover select-none pointer-events-none"
                />

                {/* Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/15 pointer-events-none" />

                {/* Badges on Top */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                  <span className="bg-[#ff2d78] text-white font-black text-[11px] px-2 py-0.5 rounded shadow-md">
                    18+
                  </span>
                  <div className="flex items-center gap-1 text-[11px] bg-black/60 px-2 py-0.5 rounded text-white font-bold backdrop-blur-md">
                    <BookOpen className="w-3.5 h-3.5 text-[#ff2d78]" />
                    <span>{comic.page_count}P</span>
                  </div>
                </div>

                {/* Bottom Title Bar (Center Card) */}
                {isCenter && (
                  <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col gap-1.5 pointer-events-none">
                    <h2 className="text-white font-black text-sm sm:text-base line-clamp-2 leading-tight">
                      {comic.title}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="flex items-center gap-1 text-[#ff2d78] font-bold">
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        {comic.favorite_count?.toLocaleString()} Suka
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* 4. Dots Indicators */}
      <div className="relative z-10 flex items-center justify-center gap-1 mt-2">
        {list.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSelect(i)}
            aria-label={`Pilih komik nomor ${i + 1}`}
            className="p-2.5 flex items-center justify-center cursor-pointer min-w-[32px] min-h-[32px]"
          >
            <span
              className={`
                h-1.5 rounded-full transition-all duration-300 block
                ${i === selectedIndex ? 'w-6 bg-[#ff2d78]' : 'w-1.5 bg-white/25 hover:bg-white/50'}
              `}
            />
          </button>
        ))}
      </div>
    </section>
  )
}
