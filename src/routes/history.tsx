import HistoryCard from '@/features/history/components/cards/HistoryCard'
import { Input } from '@/shared/shadcn/input'
import { Label } from '@/shared/shadcn/label'
import { Separator } from '@/shared/shadcn/separator'
import type { NewComicHistory } from '@/shared/utils/history'
import { getNewChapterHistories } from '@/shared/utils/history'
import { createFileRoute } from '@tanstack/react-router'
import { History } from 'lucide-react'
import { Activity, useEffect, useState } from 'react'

export const Route = createFileRoute('/history')({
  component: RouteComponent,
})

function RouteComponent() {
  const [history, setHistory] = useState<NewComicHistory[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const filteredHistory = history.filter((h) => h.comic_title.toLowerCase().includes(searchQuery.toLowerCase()))

  useEffect(() => {
    const h = getNewChapterHistories()
    setHistory(h)
  }, [])

  return (
    <div className="flex flex-col items-start justify-start min-h-screen bg-linear-to-br from-[#0f172a] via-[#0b1a33] to-black/80 text-slate-100 pt-20 md:pt-24 p-2 px-5 gap-2 pb-16 md:pb-0">
      <section className="flex flex-col md:flex-row items-start justify-between w-full gap-2">
        <Label className="text-white font-semibold text-2xl">
          <History className="w-6 h-6 text-primary" />
          Riwayat baca
        </Label>
        <div className='w-full md:w-1/2 lg:w-1/4 flex items-center justify-between gap-2'>
          <div className='flex items-center justify-start w-full h-10 bg-gray-400/20 rounded-md px-2'>
            <Input onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari Komik" className="w-full h-full aria-selected:ring-0 focus-visible:ring-0 border-0 pl-1 text-[12px] md:text-sm" />
          </div>
        </div>
      </section>
      <Separator className="bg-blue-400/20" />
      <section className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 items-center justify-start w-full gap-2">
        {filteredHistory.map((h, i) => (
          <HistoryCard key={i} h={h} index={i} />
        ))}
      </section>
    </div>
  )
}
