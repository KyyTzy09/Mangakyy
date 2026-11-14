import { useState, useEffect, useCallback } from 'react'
import { getClientCookie, setClientCookie, deleteClientCookie } from '@/shared/utils/cookie'
import { H18_COOKIE_NAME, verifyH18PasscodeFn } from '../server/auth'

const AUTH_CHANGE_EVENT = 'mangakyy_h18_auth_change'

export function useH18Auth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(getClientCookie(H18_COOKIE_NAME))
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Listen to cross-component auth events
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(Boolean(getClientCookie(H18_COOKIE_NAME)))
    }

    checkAuth()
    window.addEventListener(AUTH_CHANGE_EVENT, checkAuth)
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, checkAuth)
  }, [])

  const openModal = useCallback(() => {
    setError(null)
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setError(null)
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
      const res = await verifyH18PasscodeFn({ data: { passcode: trimmed } })
      if (res.success && res.token) {
        setClientCookie(H18_COOKIE_NAME, res.token, 30) // 30 hari sesi
        setIsAuthenticated(true)
        setIsModalOpen(false)
        window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
        return { success: true }
      } else {
        const errMsg = res.error || 'Kode akses salah!'
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
