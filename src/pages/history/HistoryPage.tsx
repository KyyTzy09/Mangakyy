import HistoryCard from '@/features/history/components/cards/HistoryCard'
import SortHistoryButton from '@/features/history/components/buttons/SortHistoryButton'
import type { SortType } from '@/features/history/components/buttons/SortHistoryButton'
import { Input } from '@/shared/shadcn/input'
import { Label } from '@/shared/shadcn/label'
import { Separator } from '@/shared/shadcn/separator'
import type { NewComicHistory } from '@/shared/utils/history'
import { getNewChapterHistories } from '@/shared/utils/history'
import { History } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'

export default function HistoryPage() {
  const [history, setHistory] = useState<NewComicHistory[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortType, setSortType] = useState<SortType>('newest')

  useEffect(() => {
    const h = getNewChapterHistories()
    setHistory(h)
  }, [])

  const filteredHistory = useMemo(() => {
    const list = history.filter((h) =>
      h.comic_title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    return list.sort((a, b) => {
      const timeA = new Date(a.last_read_at).getTime()
      const timeB = new Date(b.last_read_at).getTime()
      return sortType === 'newest' ? timeB - timeA : timeA - timeB
    })
  }, [history, searchQuery, sortType])

  return (
    <div className="flex flex-col items-start justify-start min-h-screen bg-linear-to-br from-[#0f172a] via-[#0b1a33] to-black/80 text-slate-100 pt-20 md:pt-24 p-2 px-5 gap-2 pb-16 md:pb-0">
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-2">
        <Label className="text-white font-semibold text-2xl flex items-center gap-2">
          <History className="w-6 h-6 text-primary" />
          Riwayat baca
        </Label>
        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-2">
          <div className="flex items-center justify-start w-full md:w-64 h-10 bg-gray-400/20 rounded-md px-2">
            <Input
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Komik"
              className="w-full h-full aria-selected:ring-0 focus-visible:ring-0 border-0 pl-1 text-[12px] md:text-sm"
            />
          </div>
          <SortHistoryButton onChange={(type) => setSortType(type)} />
        </div>
      </section>
      <Separator className="bg-blue-400/20" />
      {filteredHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full py-20 text-center gap-3">
          <History className="w-12 h-12 text-slate-500/50" />
          <p className="text-slate-400 font-medium">
            {searchQuery
              ? `Tidak ada komik riwayat yang cocok dengan "${searchQuery}"`
              : 'Belum ada riwayat baca'}
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 items-center justify-start w-full gap-2">
          {filteredHistory.map((h, i) => (
            <HistoryCard key={h.comic_id || i} h={h} index={i} />
          ))}
        </section>
      )}
    </div>
  )
}
