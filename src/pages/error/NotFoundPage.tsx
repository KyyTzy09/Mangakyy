import ErrorDisplay from '@/shared/components/mascot/ErrorDisplay'

export default function NotFoundPage() {
  return (
    <ErrorDisplay
      status={404}
      title="Halaman Tidak Ditemukan"
      message="Komik atau halaman yang kamu cari tidak dapat ditemukan. Mungkin URL-nya salah, chapter belum rilis, atau komik telah dipindahkan."
      showHomeButton={true}
      showExploreButton={true}
    />
  )
}
