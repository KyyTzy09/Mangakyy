import type { ErrorComponentProps } from '@tanstack/react-router'
import ErrorDisplay from '@/shared/components/mascot/ErrorDisplay'

export default function RootErrorPage({ error, reset }: ErrorComponentProps) {
  return (
    <ErrorDisplay
      status={500}
      title="Terjadi Kesalahan Server"
      message="Sistem sedang mengalami kendala sementara saat memuat data komik. Jangan khawatir, kamu bisa mencoba memuat ulang halaman ini."
      error={error}
      onRetry={() => {
        if (typeof reset === 'function') {
          reset()
        } else {
          window.location.reload()
        }
      }}
      showHomeButton={true}
      showExploreButton={true}
    />
  )
}
