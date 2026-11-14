import { useState, useEffect, useRef } from 'react'
import { createFileRoute, redirect, useNavigate, Link } from '@tanstack/react-router'
import { ArrowLeft, Home, Play, Pause } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { getClientCookie } from '@/shared/utils/cookie'
import { H18_COOKIE_NAME, getH18Detail } from '@/api/server/h18'
import { useH18Auth } from '@/features/h18/hooks/useH18Auth'
import { getH18ImageUrl } from '@/features/h18/utils/imageUrl'
import H18LockedGate from '@/features/h18/components/H18LockedGate'

export const Route = createFileRoute('/h-read/$id')({
  beforeLoad: async () => {
    if (typeof window !== 'undefined') {
      const token = getClientCookie(H18_COOKIE_NAME)
      if (!token) {
        throw redirect({
          to: '/',
          search: { auth_h18: true },
        })
      }
    }
  },
  loader: async ({ params: { id } }) => {
    try {
      const detail = await getH18Detail({ data: { id } })
      if (!detail) throw new Error('Not found')
      return { detail }
    } catch {
      throw redirect({ to: '/h18' })
    }
  },
  component: H18ReaderPage,
})

function H18ReaderPage() {
  const { detail } = Route.useLoaderData()
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

  const toggleAutoScroll = () => {
    setIsAutoScrolling((prev) => !prev)
  }

  const handleBack = () => {
    navigate({ to: '/h-detail/$id', params: { id: String(detail.id) } })
  }

  return (
    <main
      className="relative flex flex-col items-center justify-start min-h-screen bg-[#060408] text-slate-100 overflow-x-hidden select-none cursor-pointer"
      onClick={() => setIsBarsVisible((prev) => !prev)}
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
            className="fixed top-0 left-0 right-0 h-16 bg-[#0f0913]/90 border-b border-[#ff2d78]/40 backdrop-blur-xl z-50 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-xl shadow-black/60"
          >
            {/* Left: Kembali ke Detail Komik */}
            <button
              type="button"
              onClick={handleBack}
              aria-label="Kembali ke detail komik"
              className="hover:bg-[#ff2d78] hover:text-white border border-white/10 bg-white/5 cursor-pointer flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl transition-all shrink-0 min-w-[40px] min-h-[40px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold">Detail</span>
            </button>

            {/* Center: Judul Komik */}
            <div
              className="flex-1 text-center truncate font-bold text-xs sm:text-sm text-white px-2 cursor-pointer hover:text-[#ff2d78] transition-colors"
              title={detail.title}
              onClick={() => navigate({ to: '/h-detail/$id', params: { id: String(detail.id) } })}
            >
              {detail.title}
            </div>

            {/* Right: Home Katalog H18 */}
            <Link
              to="/h18"
              aria-label="Kembali ke Katalog H18"
              className="hover:bg-[#ff2d78] hover:text-white border border-white/10 bg-white/5 cursor-pointer flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl transition-all shrink-0 min-w-[40px] min-h-[40px]"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold">Katalog</span>
            </Link>
          </motion.header>
        )}
      </AnimatePresence>

      {/* 2. Comic Images Vertical Stack */}
      <section className="flex flex-col w-full max-w-3xl overflow-hidden py-1">
        {detail.images.map((img) => (
          <div key={img.page} className="relative w-full bg-slate-950 min-h-[400px]">
            <img
              src={getH18ImageUrl(img.url)}
              alt={`Halaman ${img.page}`}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
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
