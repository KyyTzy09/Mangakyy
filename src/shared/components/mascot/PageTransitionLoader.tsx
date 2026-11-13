import { useState, useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import MascotProgressRing from './MascotProgressRing'

interface PageTransitionLoaderProps {
  /** If forced to show (e.g. for route fallback / defaultPendingComponent) */
  isPendingRoute?: boolean
}

export default function PageTransitionLoader({
  isPendingRoute = false,
}: PageTransitionLoaderProps) {
  // Listen to TanStack Router global loading state
  const isRouterLoading = useRouterState({
    select: (state) => state.status === 'pending' || state.isLoading,
  })

  const shouldBeActive = isPendingRoute || isRouterLoading

  // Debounce displaying to avoid flicker on instant (<120ms) navigation
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined

    if (shouldBeActive) {
      // Small 120ms threshold to prevent flickering on instant cached transitions
      timeout = setTimeout(() => {
        setVisible(true)
      }, 120)
    } else {
      setVisible(false)
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [shouldBeActive])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="page-transition-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="fixed inset-0 z-[998] flex flex-col items-center justify-center bg-[#080C14]/85 backdrop-blur-md p-4 select-none"
          role="status"
          aria-live="polite"
          aria-label="Loading page"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-tr from-primary/15 via-sky-500/10 to-indigo-500/15 blur-2xl pointer-events-none" />

          {/* Loading Mascot inside Circular Progress Ring */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <MascotProgressRing type="loading" size="md" />

            {/* Loading text with animated ellipsis */}
            <div className="mt-5 flex flex-col items-center gap-1.5">
              <h3 className="text-lg sm:text-xl font-bold font-heading text-white tracking-wide flex items-center gap-1">
                <span>Memuat Halaman</span>
                <span className="flex">
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                  >
                    .
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                  >
                    .
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                  >
                    .
                  </motion.span>
                </span>
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-xs">
                Tunggu sebentar, sedang menyiapkan komik untukmu...
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
