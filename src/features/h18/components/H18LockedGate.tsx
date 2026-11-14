import { useState } from 'react'
import { Lock, ArrowRight, Loader2, ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useH18Auth } from '../hooks/useH18Auth'
import H18PasscodeInput from './H18PasscodeInput'

interface Props {
  onSuccess?: () => void
}

export default function H18LockedGate({ onSuccess }: Props) {
  const [passcode, setPasscode] = useState('')
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
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Lock Gate Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-[#0f0913] border border-[#ff2d78] p-6 sm:p-8 shadow-2xl shadow-[#ff2d78]/20 flex flex-col items-center text-center">
        {/* Lock Icon in Solid Pink */}
        <div className="w-14 h-14 rounded-2xl bg-[#ff2d78] text-white flex items-center justify-center shadow-lg shadow-[#ff2d78]/40 mb-3">
          <Lock className="w-7 h-7" />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold font-heading tracking-tight text-white">
          Akses Terbatas
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm leading-relaxed">
          Masukkan 11 digit kode akses untuk melanjutkan ke halaman ini.
        </p>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-6">
          <div className="flex flex-col gap-2">
            <H18PasscodeInput
              value={passcode}
              onChange={setPasscode}
              disabled={isLoading}
              autoFocus
            />

            {/* Error Message */}
            {error && (
              <p className="text-xs text-rose-400 font-medium text-center">
                {error}
              </p>
            )}
          </div>

          {/* Action Button in Solid Pink */}
          <button
            type="submit"
            disabled={passcode.length !== 11 || isLoading}
            className="w-full h-11 rounded-xl bg-[#ff2d78] hover:bg-[#e02068] disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-lg shadow-[#ff2d78]/30 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <span>Buka Akses</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  )
}
