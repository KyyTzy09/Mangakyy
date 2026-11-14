import { useState, useEffect, useRef } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { ArrowLeft, Home, Play, Pause, AlertCircle, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { getH18Detail } from '@/api/server/h18'
import { useH18Auth } from '@/features/h18/hooks/useH18Auth'
import { getH18ImageUrl } from '@/features/h18/utils/imageUrl'
import H18LockedGate from '@/features/h18/components/H18LockedGate'

export const Route = createFileRoute('/h-read/$id')({
  loader: async ({ params: { id } }) => {
    try {
      const cleanId = String(id).replace(/[^0-9]/g, '')
      const detail = await getH18Detail({ data: { id: cleanId || id } })
      return { detail, id: cleanId || id }
    } catch (err) {
      console.error('[H18Read] Error loading reader:', err)
      return { detail: null, id }
    }
  },
  component: H18ReaderPage,
})

function H18ReaderPage() {
  const { detail, id } = Route.useLoaderData()
  const { isAuthenticated } = useH18Auth()
  const navigate = useNavigate()

  const [isBarsVisible, setIsBarsVisible] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(false)
  const autoScrollTimerRef = useRef<number | null>(null)

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        const current = (window.scrollY / totalHeight) * 100
        setScrollProgress(Math.min(100, Math.max(0, current)))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto scroll effect
  useEffect(() => {
    if (isAutoScrolling) {
      autoScrollTimerRef.current = window.setInterval(() => {
        window.scrollBy({ top: 2, behavior: 'smooth' })
      }, 30)
    } else if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current)
      autoScrollTimerRef.current = null
    }

    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current)
      }
    }
  }, [isAutoScrolling])

  if (!isAuthenticated) {
    return <H18LockedGate onSuccess={() => window.location.reload()} />
  }

  if (!detail) {
    return (
      <main className="relative flex flex-col items-center justify-center min-h-screen bg-[#08050a] text-slate-100 p-4">
        <div className="flex flex-col items-center text-center max-w-md p-8 rounded-2xl bg-[#0f0913] border border-white/10 shadow-2xl gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#ff2d78]/15 border border-[#ff2d78] text-[#ff2d78] flex items-center justify-center">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Komik Tidak Ditemukan</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Halaman komik #{id} tidak dapat dimuat. Silakan coba muat ulang.
          </p>
          <div className="flex items-center gap-3 mt-2 w-full">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex-1 py-2.5 rounded-xl bg-[#ff2d78] hover:bg-[#e02068] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Coba Lagi</span>
            </button>
            <Link
              to="/h18"
              className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition-colors text-center"
            >
              Ke Katalog
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const toggleBars = () => {
    setIsBarsVisible((prev) => !prev)
  }

  const toggleAutoScroll = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAutoScrolling((prev) => !prev)
  }

  const handleBackToDetail = () => {
    navigate({
      to: '/h-detail/$id',
      params: { id: String(detail.id) },
    })
  }

  return (
    <main
      onClick={toggleBars}
      className="relative flex flex-col items-center justify-start min-h-screen bg-[#050307] text-slate-100 select-none overflow-x-hidden"
    >
      {/* 1. Floating Top Bar in Solid Pink Style */}
      <AnimatePresence>
        {isBarsVisible && (
          <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="fixed top-0 inset-x-0 h-16 bg-[#0f0913]/90 border-b border-[#ff2d78]/40 backdrop-blur-xl z-50 px-4 sm:px-6 flex items-center justify-between shadow-2xl"
          >
            {/* Left Back button */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={handleBackToDetail}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#ff2d78] text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                title="Kembali ke Detail Komik"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md md:max-w-xl">
                {detail.title}
              </h1>
            </div>

            {/* Right Home Link */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/h18"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#ff2d78] text-white flex items-center justify-center transition-all"
                title="Katalog H18"
              >
                <Home className="w-4 h-4" />
              </Link>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* 2. Comic Images Vertical Stack with Full Width */}
      <section className="w-full max-w-4xl flex flex-col items-center pt-16 pb-24 gap-1">
        {detail.images.map((img) => (
          <div key={img.page} className="relative w-full bg-slate-950 min-h-[400px]">
            <img
              src={getH18ImageUrl(img.url)}
              alt={`Halaman ${img.page}`}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget
                if (img.url && !target.src.includes(img.url)) {
                  target.src = img.url
                }
              }}
              className="flex w-full h-auto select-none pointer-events-none"
            />
          </div>
        ))}
      </section>

      {/* 3. Floating Bottom Bar in Solid Pink Style */}
      <AnimatePresence>
        {isBarsVisible && (
          <motion.footer
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-[#0f0913]/90 border border-[#ff2d78]/40 backdrop-blur-xl z-50 rounded-2xl p-3 flex flex-col gap-2 shadow-2xl shadow-black/80"
          >
            {/* Top Bar inside Bottom Bar: Page Indicator & Auto Scroll */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-semibold text-slate-300">
                Total: <strong className="text-[#ff2d78]">{detail.images.length}</strong> Halaman
              </span>

              {/* Auto Scroll Toggle Button */}
              <button
                type="button"
                onClick={toggleAutoScroll}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isAutoScrolling
                    ? 'bg-[#ff2d78] text-white shadow-md shadow-[#ff2d78]/40'
                    : 'bg-white/10 hover:bg-white/20 text-slate-300'
                }`}
              >
                {isAutoScrolling ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Stop Scroll</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Auto Scroll</span>
                  </>
                )}
              </button>
            </div>

            {/* Reading Progress Bar in Solid Pink */}
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ff2d78] transition-all duration-150 rounded-full"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </main>
  )
}