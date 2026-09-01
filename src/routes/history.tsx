import HistoryPage from '@/pages/history'
import { NOINDEX_ROBOTS, SITE_NAME } from '@/shared/utils/seo'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/history')({
  component: HistoryPage,
  head: () => ({
    meta: [
      {
        title: `Riwayat Baca Komik - ${SITE_NAME}`,
      },
      {
        name: 'robots',
        content: NOINDEX_ROBOTS,
      },
    ],
  }),
})
