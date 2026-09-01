import HistoryDetailPage from '@/pages/history-detail'
import { NOINDEX_ROBOTS, SITE_NAME } from '@/shared/utils/seo'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/history-detail/$mangaId')({
  component: HistoryDetailPage,
  head: () => ({
    meta: [
      {
        title: `Detail Riwayat Baca - ${SITE_NAME}`,
      },
      {
        name: 'robots',
        content: NOINDEX_ROBOTS,
      },
    ],
  }),
})
