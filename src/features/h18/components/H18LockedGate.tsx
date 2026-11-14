import { useState } from 'react'
import { Lock, Eye, EyeOff, ShieldAlert, ArrowRight, Loader2, ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useH18Auth } from '../hooks/useH18Auth'

interface Props {
  onSuccess?: () => void
}

export default function H18LockedGate({ onSuccess }: Props) {
  const [passcode, setPasscode] = useState('')
  const [showPasscode, setShowPasscode] = useState(false)
  const { authenticate, isLoading, error } = useH18Auth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passcode.length !== 11) return

    const res = await authenticate(passcode)
    if (res.success && onSuccess) {
      onSuccess()
    }
  }

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-[#08050a] text-slate-100 p-4 overflow-hidden">
      {/* Ambient Solid Pink Background Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#ff2d78]/10 blur-3xl pointer-events-none"
      />

      {/* Top Back to Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-all backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke MangaKyy</span>
        </Link>
      </div>

      {/* Lock Gate Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-[#0f0913] border-2 border-[#ff2d78] p-6 sm:p-8 shadow-2xl shadow-[#ff2d78]/20 flex flex-col items-center text-center">
        {/* Lock Icon in Solid Pink */}
        <div className="w-16 h-16 rounded-2xl bg-[#ff2d78] text-white flex items-center justify-center shadow-lg shadow-[#ff2d78]/40 mb-3">
          <Lock className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff2d78]/15 border border-[#ff2d78] text-xs font-bold text-[#ff2d78] mb-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>ZONA 18+ TERKUNCI</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
          Akses Mode H18
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm leading-relaxed">
          Halaman ini dibatasi khusus pengguna dewasa. Masukkan kode akses rahasia{' '}
          <strong className="text-[#ff2d78]">11 digit</strong> untuk membuka sesi bacaan.
        </p>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs px-1 font-semibold text-slate-300">
              <label htmlFor="gate-passcode-input">Kode Akses (11 Digit):</label>
              <span
                className={`font-mono text-xs font-bold ${
                  passcode.length === 11 ? 'text-[#ff2d78]' : 'text-slate-400'
                }`}
              >
                {passcode.length} / 11
              </span>
            </div>

            <div className="relative flex items-center">
              <input
                id="gate-passcode-input"
                type={showPasscode ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value.slice(0, 11))}
                maxLength={11}
                placeholder="Masukkan 11 digit..."
                className="w-full h-12 bg-black/70 border-2 border-white/20 focus:border-[#ff2d78] rounded-xl px-4 pr-12 text-center font-mono text-base tracking-widest text-white outline-none transition-all placeholder:text-slate-600 placeholder:tracking-normal placeholder:text-sm"
              />

              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                aria-label={showPasscode ? 'Sembunyikan kode' : 'Lihat kode'}
                className="absolute right-3 p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs text-center font-medium">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || passcode.length !== 11}
            className="w-full h-12 rounded-xl bg-[#ff2d78] hover:bg-[#e02068] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-lg shadow-[#ff2d78]/30 flex items-center justify-center gap-2 cursor-pointer mt-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <span>Buka Mode H18</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-400 mt-1">
            Sesi tersimpan aman di cookie peramban selama 30 hari.
          </p>
        </form>
      </div>
    </main>
  )
}
