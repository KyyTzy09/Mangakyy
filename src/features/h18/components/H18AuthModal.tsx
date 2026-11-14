import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Lock, X, ArrowRight, Loader2 } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useH18Auth } from '../hooks/useH18Auth'
import H18PasscodeInput from './H18PasscodeInput'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function H18AuthModal({ isOpen, onClose, onSuccess }: Props) {
  const [passcode, setPasscode] = useState('')
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
          aria-label="Verifikasi Akses"
          onClick={onClose}
        >
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl bg-[#0f0913] border border-[#ff2d78] p-6 shadow-2xl text-white overflow-hidden"
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

            {/* Header */}
            <div className="flex flex-col items-center text-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#ff2d78] text-white flex items-center justify-center shadow-lg shadow-[#ff2d78]/40 mb-1">
                <Lock className="w-6 h-6" />
              </div>

              <h2 className="text-xl font-bold font-heading tracking-tight text-white">
                Akses Terbatas
              </h2>

              <p className="text-xs sm:text-sm text-slate-400 max-w-xs leading-relaxed">
                Masukkan 11 digit kode akses untuk membuka halaman ini.
              </p>
            </div>

            {/* Form Passcode OTP Input */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <H18PasscodeInput
                  value={passcode}
                  onChange={setPasscode}
                  disabled={isLoading}
                  autoFocus={isOpen}
                />

                {/* Error Banner */}
                {error && (
                  <p className="text-xs text-rose-400 font-medium text-center">
                    {error}
                  </p>
                )}
              </div>

              {/* Submit Button */}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
