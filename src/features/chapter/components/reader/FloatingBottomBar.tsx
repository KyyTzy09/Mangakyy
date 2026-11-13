import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Play, Pause, Settings, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/shared/shadcn/button'
import SpeedSlider from './SpeedSlider'

interface FloatingBottomBarProps {
  isVisible: boolean
  isSpeedMode: boolean
  isAutoScrolling: boolean
  scrollSpeed: number
  prevChapterId: string | null
  prevChapterNumber: number | null
  nextChapterId: string | null
  nextChapterNumber: number | null
  onPrev: () => void
  onNext: () => void
  onToggleAutoScroll: () => void
  onEnterSpeedMode: () => void
  onExitSpeedMode: () => void
  onSpeedChange: (speed: number) => void
}

export default function FloatingBottomBar({
  isVisible,
  isSpeedMode,
  isAutoScrolling,
  scrollSpeed,
  prevChapterId,
  prevChapterNumber,
  nextChapterId,
  nextChapterNumber,
  onPrev,
  onNext,
  onToggleAutoScroll,
  onEnterSpeedMode,
  onExitSpeedMode,
  onSpeedChange,
}: FloatingBottomBarProps) {
  // Real-time Reading Progress (0 - 100%)
  const [readingProgress, setReadingProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight <= 0) {
        setReadingProgress(0)
        return
      }
      const current = window.scrollY
      const progress = Math.min(Math.max((current / totalHeight) * 100, 0), 100)
      setReadingProgress(Math.round(progress))
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [isVisible])

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const ratio = Math.min(Math.max(clickX / rect.width, 0), 1)
    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({
      top: ratio * totalHeight,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl bg-[#111]/90 border-t border-white/10 backdrop-blur-xl z-50 rounded-t-2xl p-2.5 sm:p-3.5 text-white shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {isSpeedMode ? (
              <SpeedSlider
                speed={scrollSpeed}
                onSpeedChange={onSpeedChange}
                onDone={onExitSpeedMode}
              />
            ) : (
              <motion.div
                key="normal-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between gap-1.5 sm:gap-3 w-full"
              >
                {/* 1. Previous Chapter Button */}
                <Button
                  variant="ghost"
                  onClick={onPrev}
                  disabled={prevChapterId === null}
                  className="shrink-0 text-white hover:bg-white/10 hover:text-white px-2 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium disabled:opacity-30 disabled:pointer-events-none"
                  title="Chapter Sebelumnya"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1 sm:mr-1.5" />
                  <span className="hidden xs:inline">Ch.</span>
                  {prevChapterNumber ?? '-'}
                </Button>

                {/* 2. Center Reading Area: Button Play/Pause (Kiri) - Progress Bar (Tengah) - Button Settings (Kanan) */}
                <div className="flex-1 flex items-center gap-1.5 sm:gap-2.5 min-w-0 bg-white/[0.04] border border-white/5 px-2 py-1.5 rounded-xl">
                  {/* Button Kiri: Auto-Scroll Play/Pause */}
                  <button
                    type="button"
                    onClick={onToggleAutoScroll}
                    className="shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/5 hover:bg-primary/20 text-white hover:text-primary transition-all active:scale-95 cursor-pointer"
                    title={isAutoScrolling ? 'Jeda Auto-Scroll' : 'Mulai Auto-Scroll'}
                  >
                    {isAutoScrolling ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>

                  {/* Di Antara Kedua Button: Reading Progress Bar */}
                  <div
                    onClick={handleProgressBarClick}
                    className="flex-1 flex flex-col justify-center gap-1 cursor-pointer group min-w-0 py-0.5 select-none"
                    title={`Progress baca: ${readingProgress}% (Klik untuk lompat)`}
                  >
                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-300 font-medium">
                      <span className="text-slate-400 truncate">Baca</span>
                      <span className="text-primary font-bold">{readingProgress}%</span>
                    </div>
                    {/* Track & Filled Bar */}
                    <div className="relative w-full h-1.5 sm:h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-150"
                        style={{ width: `${readingProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Button Kanan: Speed Settings */}
                  <button
                    type="button"
                    onClick={onEnterSpeedMode}
                    className="shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/5 hover:bg-primary/20 text-white hover:text-primary transition-all active:scale-95 cursor-pointer"
                    title="Atur Kecepatan Scroll"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>

                {/* 3. Next Chapter Button */}
                <Button
                  variant="ghost"
                  onClick={onNext}
                  disabled={nextChapterId === null}
                  className="shrink-0 text-white hover:bg-white/10 hover:text-white px-2 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium disabled:opacity-30 disabled:pointer-events-none"
                  title="Chapter Berikutnya"
                >
                  <span className="hidden xs:inline">Ch.</span>
                  {nextChapterNumber ?? '-'}
                  <ArrowRight className="w-3.5 h-3.5 ml-1 sm:mr-1.5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
