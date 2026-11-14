import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getClientCookie } from '@/shared/utils/cookie'
import { H18_COOKIE_NAME } from '@/features/h18/server/auth'
import { useH18Auth } from '@/features/h18/hooks/useH18Auth'
import H18LockedGate from '@/features/h18/components/H18LockedGate'

export const Route = createFileRoute('/h18')({
  beforeLoad: async () => {
    // Client-side quick check
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
  component: H18Layout,
})

function H18Layout() {
  const { isAuthenticated } = useH18Auth()

  if (!isAuthenticated) {
    return <H18LockedGate onSuccess={() => window.location.reload()} />
  }

  return <Outlet />
}
