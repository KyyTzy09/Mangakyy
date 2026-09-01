import HistoryDetailPage from '@/pages/history-detail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/history-detail/$mangaId')({
  component: HistoryDetailPage,
})
