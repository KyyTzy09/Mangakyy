import { Button } from '@/shared/shadcn/button'
import { useNavigate } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'

export interface ChapterEndSheetProps {
  isVisible: boolean
  chapterNumber: number
  nextChapterId: string | null
  nextChapterNumber: number | null
  mangaId: string
  onContinue: () => void // lanjut ke chapter berikutnya
  onDismiss: () => void // tutup sheet, tetap di halaman
}

export default function ChapterEndSheet({
  isVisible,
  chapterNumber,
  nextChapterId,
  nextChapterNumber,
  mangaId,
  onContinue,
  onDismiss,
}: ChapterEndSheetProps) {
  const navigate = useNavigate()
  const hasNextChapter = nextChapterId !== null

  const handlePrimaryClick = () => {
    if (hasNextChapter) {
      onContinue()
    } else {
      navigate({
        to: '/detail/$mangaId',
        params: { mangaId },
      })
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onDismiss}
            className="fixed inset-0 bg-black/50 z-[55]"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl bg-[#111]/95 backdrop-blur-xl z-[60] rounded-t-2xl p-6"
          >
            {/* Handle bar */}
            <div className="w-12 h-1 bg-gray-500 rounded-full mx-auto mb-4" />

            {/* Heading */}
            <h3 className="text-xl font-semibold text-white text-center mb-6">
              {hasNextChapter
                ? `Chapter ${chapterNumber} Selesai`
                : 'Chapter Terakhir'}
            </h3>

            {/* Primary Action Button */}
            <Button
              onClick={handlePrimaryClick}
              className="w-full bg-primary text-white hover:bg-blue-400 py-3 h-auto rounded-xl mb-3 cursor-pointer"
            >
              {hasNextChapter
                ? `Lanjut Ch. ${nextChapterNumber} →`
                : 'Kembali ke Detail Manga'}
            </Button>

            {/* Secondary Action Button */}
            <Button
              variant="outline"
              onClick={onDismiss}
              className="w-full bg-transparent border border-gray-500 text-white hover:bg-gray-800 py-3 h-auto rounded-xl cursor-pointer"
            >
              {hasNextChapter ? 'Kembali' : 'Tetap di Sini'}
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
