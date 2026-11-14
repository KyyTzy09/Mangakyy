import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Lock, Eye, EyeOff, ShieldAlert, X, ArrowRight, Loader2 } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useH18Auth } from '../hooks/useH18Auth'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function H18AuthModal({ isOpen, onClose, onSuccess }: Props) {
  const [passcode, setPasscode] = useState('')
  const [showPasscode, setShowPasscode] = useState(false)
  const { authenticate, isLoading, error } = useH18Auth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      setPasscode('')
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passcode.length !== 11) return

    const res = await authenticate(passcode)
    if (res.success) {
      if (onSuccess) {
        onSuccess()
      } else {
        navigate({ to: '/h18' })
      }
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="h18-auth-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Verifikasi Akses Mode H18"
          onClick={onClose}
        >
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl bg-[#0f0913] border-2 border-[#ff2d78] p-6 shadow-2xl text-white overflow-hidden"
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup modal"
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Solid Pink Badge */}
            <div className="flex flex-col items-center text-center gap-2 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#ff2d78] text-white flex items-center justify-center shadow-lg shadow-[#ff2d78]/40 mb-1">
                <Lock className="w-7 h-7" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ff2d78]/15 border border-[#ff2d78] text-xs font-bold text-[#ff2d78]">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>ZONA 18+ TERBATAS</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white mt-1">
                Autentikasi Mode H18
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xs leading-relaxed">
                Area ini khusus pengguna dewasa. Masukkan kode akses rahasia{' '}
                <strong className="text-[#ff2d78]">11 digit</strong> untuk membuka sesi.
              </p>
            </div>

            {/* Form Passcode Input */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs px-1 font-semibold text-slate-300">
                  <label htmlFor="h18-passcode-input">Kode Akses (11 Digit):</label>
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
                    id="h18-passcode-input"
                    type={showPasscode ? 'text' : 'password'}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value.slice(0, 11))}
                    maxLength={11}
                    autoFocus
                    placeholder="Masukkan 11 digit..."
                    className="w-full h-12 bg-black/60 border-2 border-white/15 focus:border-[#ff2d78] rounded-xl px-4 pr-12 text-center font-mono text-base tracking-widest text-white outline-none transition-all placeholder:text-slate-600 placeholder:tracking-normal placeholder:text-sm"
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

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-sm transition-colors cursor-pointer border border-white/10"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isLoading || passcode.length !== 11}
                  className="flex-1 h-11 rounded-xl bg-[#ff2d78] hover:bg-[#e02068] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-lg shadow-[#ff2d78]/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memverifikasi...</span>
                    </>
                  ) : (
                    <>
                      <span>Buka H18</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-300 mt-1">
                Sesi akan tersimpan selama 30 hari di peramban ini.
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
