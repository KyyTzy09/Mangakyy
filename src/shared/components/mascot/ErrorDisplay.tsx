import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Home, RefreshCw, Compass, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import MascotProgressRing from './MascotProgressRing'
import { Button } from '@/shared/shadcn/button'

export interface ErrorDisplayProps {
  status?: number | string
  title?: string
  message?: string
  error?: unknown
  onRetry?: () => void
  showHomeButton?: boolean
  showExploreButton?: boolean
}

export default function ErrorDisplay({
  status = 404,
  title,
  message,
  error,
  onRetry,
  showHomeButton = true,
  showExploreButton = true,
}: ErrorDisplayProps) {
  const navigate = useNavigate()
  const [showDetails, setShowDetails] = useState(false)

  const is404 = status === 404 || status === '404'
  const is500 = status === 500 || status === '500'

  const defaultTitle = is404
    ? 'Halaman Tidak Ditemukan'
    : is500
      ? 'Terjadi Kesalahan Server'
      : 'Ups! Terjadi Masalah'

  const defaultMessage = is404
    ? 'Sepertinya komik atau halaman yang kamu tuju telah berpindah dimensi, dihapus, atau tautan yang kamu buka keliru.'
    : 'Maaf, server MangaKyy sedang mengalami kendala teknis saat memproses permintaan ini. Silakan coba muat ulang.'

  const displayTitle = title || defaultTitle
  const displayMessage = message || defaultMessage

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : null

  const errorStack = error instanceof Error ? error.stack : null

  return (
    <main className="relative flex flex-col items-center justify-center min-h-[75vh] w-full max-w-4xl mx-auto px-4 py-16 text-center select-none overflow-hidden">
      {/* Ambient Red Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-tr from-rose-600/15 via-red-500/10 to-amber-500/15 blur-3xl pointer-events-none" />

      {/* Mascot inside Error Progress Ring */}
      <div className="relative z-10 flex flex-col items-center mb-6">
        <MascotProgressRing type="error" size="lg" />

        {/* Status Code Badge */}
        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-extrabold text-xs sm:text-sm tracking-wider shadow-lg shadow-rose-500/10">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>ERROR {status}</span>
        </div>
      </div>

      {/* Error Headings & Description */}
      <div className="relative z-10 flex flex-col items-center max-w-lg w-full gap-2.5">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading text-white tracking-tight leading-tight">
          {displayTitle}
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
          {displayMessage}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8 w-full max-w-md">
        {onRetry && (
          <Button
            type="button"
            onClick={onRetry}
            className="flex-1 min-w-36 h-11 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Coba Lagi</span>
          </Button>
        )}

        {showHomeButton && (
          <Button
            type="button"
            onClick={() => navigate({ to: '/' })}
            className={`flex-1 min-w-36 h-11 ${
              onRetry
                ? 'bg-slate-800 hover:bg-slate-700 text-white border border-white/10'
                : 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20'
            } font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer`}
          >
            <Home className="w-4 h-4" />
            <span>Ke Beranda</span>
          </Button>
        )}

        {showExploreButton && (
          <Link
            to="/explore"
            className="flex-1 min-w-36 h-11 bg-slate-800 hover:bg-slate-700 text-white border border-white/10 font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Jelajahi Komik</span>
          </Link>
        )}
      </div>

      {/* Developer Technical Stack Trace (Collapsible) */}
      {errorMessage && (
        <div className="relative z-10 mt-10 max-w-xl w-full text-left">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-xs font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 transition cursor-pointer"
          >
            <span className="truncate">Rincian Teknis: {errorMessage}</span>
            {showDetails ? (
              <ChevronUp className="w-4 h-4 shrink-0 ml-2" />
            ) : (
              <ChevronDown className="w-4 h-4 shrink-0 ml-2" />
            )}
          </button>

          {showDetails && (
            <div className="mt-2 p-3.5 rounded-xl bg-black/60 border border-red-500/20 text-[11px] font-mono text-rose-300/90 overflow-x-auto max-h-48 whitespace-pre-wrap select-text">
              <p className="font-bold text-rose-400 mb-1">{errorMessage}</p>
              {errorStack && <pre className="text-slate-400 text-[10px] leading-tight">{errorStack}</pre>}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
