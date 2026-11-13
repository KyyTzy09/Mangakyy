import { Button } from '@/shared/shadcn/button'
import { ArrowLeft, Home } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useNavigate } from '@tanstack/react-router'

interface FloatingTopBarProps {
  title: string
  chapterNumber: number
  isVisible: boolean
  onBack: () => void
}

export default function FloatingTopBar({
  title,
  isVisible,
  onBack,
}: FloatingTopBarProps) {
  const navigate = useNavigate()

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl bg-[#111]/90 border-b border-white/10 backdrop-blur-xl z-50 rounded-b-2xl p-3 sm:p-4 text-white flex items-center justify-between gap-3 shadow-2xl"
        >
          {/* Left: Kembali ke Detail Manga (Icon only di layar kecil) */}
          <Button
            onClick={onBack}
            className="hover:bg-primary/20 hover:text-primary border border-white/10 bg-white/5 cursor-pointer flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl transition-all shrink-0"
            title="Kembali ke Detail Manga"
          >
            <ArrowLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            <span className="hidden sm:inline text-xs sm:text-sm font-medium">
              Detail Manga
            </span>
          </Button>

          {/* Center: Judul Komik di Tengah (Hanya judul tanpa nomor chapter) */}
          <div
            onClick={onBack}
            className="flex-1 text-center truncate font-semibold text-sm sm:text-base text-white hover:text-primary transition-colors cursor-pointer px-1"
            title={title}
          >
            {title}
          </div>

          {/* Right: Tombol Kembali ke Beranda / Home (route '/') */}
          <Button
            onClick={() => navigate({ to: '/' })}
            className="hover:bg-primary/20 hover:text-primary border border-white/10 bg-white/5 cursor-pointer flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl transition-all shrink-0"
            title="Kembali ke Beranda"
          >
            <Home className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            <span className="hidden sm:inline text-xs sm:text-sm font-medium">
              Beranda
            </span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
