import { motion } from 'motion/react'
import { RotateCcw } from 'lucide-react'

interface SectionEmptyStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function SectionEmptyState({
  title = 'Data Tidak Tersedia',
  message = 'Belum ada data komik yang ditemukan untuk kategori ini.',
  onRetry,
  size = 'md',
  className = '',
}: SectionEmptyStateProps) {
  const imageSize =
    size === 'sm'
      ? 'w-20 h-20 sm:w-24 sm:h-24'
      : size === 'lg'
        ? 'w-36 h-36 sm:w-44 sm:h-44'
        : 'w-28 h-28 sm:w-32 sm:h-32'

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-[#0c121e]/60 border border-white/5 backdrop-blur-sm select-none ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative flex items-center justify-center"
      >
        {/* Soft glow behind mascot */}
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl transform scale-125 pointer-events-none" />
        <img
          src="/mascots/error.webp"
          alt="Data Kosong"
          className={`${imageSize} object-contain relative z-10 drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]`}
          loading="lazy"
          decoding="async"
        />
      </motion.div>

      <div className="flex flex-col gap-1 mt-3 max-w-sm">
        <h4 className="text-white font-bold text-sm sm:text-base font-heading tracking-wide">
          {title}
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed">{message}</p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-primary text-xs font-semibold text-slate-200 hover:text-white border border-white/10 hover:border-primary/40 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Coba Muat Ulang</span>
        </button>
      )}
    </div>
  )
}
