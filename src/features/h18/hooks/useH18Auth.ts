import { useState, useEffect, useCallback } from 'react'
import { getClientCookie, setClientCookie, deleteClientCookie } from '@/shared/utils/cookie'
import { H18_COOKIE_NAME, verifyH18Passcode } from '@/api/server/h18'

const AUTH_CHANGE_EVENT = 'mangakyy_h18_auth_change'
const MODAL_OPEN_EVENT = 'mangakyy_h18_modal_open'
const MODAL_CLOSE_EVENT = 'mangakyy_h18_modal_close'

export function openH18Modal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(MODAL_OPEN_EVENT))
  }
}

export function closeH18Modal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(MODAL_CLOSE_EVENT))
  }
}

export function useH18Auth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(getClientCookie(H18_COOKIE_NAME))
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(Boolean(getClientCookie(H18_COOKIE_NAME)))
    }
    const handleOpen = () => {
      setError(null)
      setIsModalOpen(true)
    }
    const handleClose = () => {
      setIsModalOpen(false)
      setError(null)
    }

    handleAuthChange()
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange)
    window.addEventListener(MODAL_OPEN_EVENT, handleOpen)
    window.addEventListener(MODAL_CLOSE_EVENT, handleClose)

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange)
      window.removeEventListener(MODAL_OPEN_EVENT, handleOpen)
      window.removeEventListener(MODAL_CLOSE_EVENT, handleClose)
    }
  }, [])

  const openModal = useCallback(() => {
    openH18Modal()
  }, [])

  const closeModal = useCallback(() => {
    closeH18Modal()
  }, [])

  const authenticate = useCallback(async (passcode: string) => {
    const trimmed = passcode.trim()
    if (trimmed.length !== 11) {
      setError('Kode akses harus tepat 11 digit!')
      return { success: false, error: 'Kode akses harus tepat 11 digit!' }
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await verifyH18Passcode({ data: { passcode: trimmed } })
      if (res.success && res.token) {
        setClientCookie(H18_COOKIE_NAME, res.token, 30) // 30 hari sesi
        setIsAuthenticated(true)
        closeH18Modal()
        window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
        return { success: true }
      } else {
        const errMsg = res.error || 'Kode akses tidak cocok!'
        setError(errMsg)
        return { success: false, error: errMsg }
      }
    } catch {
      const errMsg = 'Gagal memverifikasi kode akses. Silakan coba lagi.'
      setError(errMsg)
      return { success: false, error: errMsg }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    deleteClientCookie(H18_COOKIE_NAME)
    setIsAuthenticated(false)
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
  }, [])

  return {
    isAuthenticated,
    isModalOpen,
    isLoading,
    error,
    openModal,
    closeModal,
    authenticate,
    logout,
  }
}
