import { Button } from '@/shared/shadcn/button'
import { ArrowLeft } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

interface FloatingTopBarProps {
  title: string
  chapterNumber: number
  isVisible: boolean
  onBack: () => void
}

export default function FloatingTopBar({
  title,
  chapterNumber,
  isVisible,
  onBack,
}: FloatingTopBarProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl bg-[#111]/90 backdrop-blur-xl z-50 rounded-b-xl p-4 text-white flex items-center justify-between"
        >
          <Button
            onClick={onBack}
            className="hover:bg-blue-400"
          >
            <ArrowLeft />
            Kembali
          </Button>
          <div
            className="text-right truncate max-w-[60%] sm:max-w-[70%] font-medium text-sm sm:text-base"
            title={`${title} - Ch. ${chapterNumber}`}
          >
            {title} - Ch. {chapterNumber}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
