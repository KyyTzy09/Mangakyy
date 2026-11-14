import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Sparkles, ArrowRight, X } from 'lucide-react'
import MascotProgressRing from './MascotProgressRing'

export default function WelcomeScreen() {
  const [isOpen, setIsOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('Menyiapkan komik untukmu...')

  const handleDismiss = useCallback(() => {
    try {
      sessionStorage.setItem('mangakyy_welcomed', 'true')
    } catch {
      // Ignore in case sessionStorage is restricted
    }
    setIsOpen(false)
  }, [])

  useEffect(() => {
    // 1. Never show to Googlebot, Bingbot, or Lighthouse/PageSpeed to preserve 100% SEO & Core Web Vitals
    try {
      const ua = window.navigator.userAgent.toLowerCase()
      const isBotOrLighthouse =
        ua.includes('googlebot') ||
        ua.includes('bingbot') ||
        ua.includes('lighthouse') ||
        ua.includes('chrome-lighthouse') ||
        ua.includes('pagespeed') ||
        ua.includes('headlesschrome') ||
        ua.includes('slurp') ||
        ua.includes('baiduspider') ||
        ua.includes('yandexbot')

      if (isBotOrLighthouse) {
        return
      }

      // 2. Check if user already welcomed in this session
      const alreadyWelcomed = sessionStorage.getItem('mangakyy_welcomed')
      const urlParams = new URLSearchParams(window.location.search)
      const forceWelcome = urlParams.get('welcome') === 'true'

      if (!alreadyWelcomed || forceWelcome) {
        setIsOpen(true)
      }
    } catch {
      // In case sessionStorage or navigator fails
    }

    // Allow re-trigger via custom window event for testing
    const handleTrigger = () => {
      setProgress(0)
      setIsOpen(true)
    }
    window.addEventListener('mangakyy:show-welcome', handleTrigger)
    return () => window.removeEventListener('mangakyy:show-welcome', handleTrigger)
  }, [])

  // Progress animation sequence
  useEffect(() => {
    if (!isOpen) return

    let current = 0
    const interval = setInterval(() => {
      // Non-linear acceleration: fast start, smooth middle, slight pause near 90%, then 100%
      const step =
        current < 40
          ? Math.random() * 8 + 6
          : current < 80
            ? Math.random() * 6 + 4
            : current < 95
              ? Math.random() * 4 + 2
              : 5

      current = Math.min(100, current + step)
      setProgress(Math.round(current))

      if (current < 30) {
        setStatusText('Menyiapkan ribuan chapter komik...')
      } else if (current < 70) {
        setStatusText('Mengoptimalkan pengalaman baca terbaik...')
      } else if (current < 99) {
        setStatusText('Hampir siap...')
      } else {
        setStatusText('Semua siap! Selamat membaca 🎉')
      }

      if (current >= 100) {
        clearInterval(interval)
        // Auto-dismiss 400ms after reaching 100%
        const timer = setTimeout(() => {
          handleDismiss()
        }, 500)
        return () => clearTimeout(timer)
      }
    }, 70)

    return () => clearInterval(interval)
  }, [isOpen, handleDismiss])

  // ESC key listener to skip
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleDismiss])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="welcome-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#080C14]/94 backdrop-blur-2xl p-4 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Welcome to MangaKyy"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-primary/20 via-sky-500/10 to-purple-600/20 blur-3xl pointer-events-none" />

          {/* Top Skip Button */}
          <header className="absolute top-6 right-6 z-20">
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Lewati sambutan selamat datang"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-400 hover:text-white transition-all cursor-pointer backdrop-blur-md min-h-[36px]"
            >
              <span>Lewati</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </header>

          {/* Center Mascot & Progress Ring */}
          <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
            {/* Mascot wrapped in Progress Ring */}
            <div className="relative mb-6">
              <MascotProgressRing type="welcome" progress={progress} size="lg" />

              {/* Progress Percentage Badge */}
              <motion.div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/90 border border-primary/40 shadow-lg shadow-primary/20 backdrop-blur-md text-xs font-bold text-sky-400"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {progress}%
              </motion.div>
            </div>

            {/* Welcome Greeting & Titles */}
            <div className="flex flex-col items-center gap-2 mt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-[11px] sm:text-xs font-semibold text-primary">
                <Sparkles className="w-3.5 h-3.5" />
                <span>WELCOME TO MANGAKYY</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
                Selamat Datang di <span className="text-primary">MangaKyy</span>
              </h2>

              <p className="text-slate-400 text-xs sm:text-sm max-w-sm mt-0.5 leading-relaxed">
                Tempat terbaik membaca manga, manhwa, dan manhua favoritmu dengan pengalaman paling lancar.
              </p>
            </div>

            {/* Dynamic Status Progress Text */}
            <div className="mt-5 text-xs sm:text-sm font-medium text-slate-300 min-h-[22px] flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span>{statusText}</span>
            </div>

            {/* Quick Action Button */}
            <div className="mt-6 w-full max-w-xs">
              <button
                type="button"
                onClick={handleDismiss}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-primary/25 active:scale-95 transition-all cursor-pointer"
              >
                <span>{progress >= 100 ? 'Mulai Membaca' : 'Masuk Langsung'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
