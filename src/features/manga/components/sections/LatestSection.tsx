import { useState } from 'react'
import { Button } from '@/shared/shadcn/button'
import type { APIResponse, UpdateComic } from '@/shared/interfaces'
import { useNavigate } from '@tanstack/react-router'
import { LucideTimer } from 'lucide-react'
import LatestCard from '@/features/manga/components/cards/LatestCard'
import { useGetUpdateManga } from '@/features/manga/hooks/MangaQuery'
import SectionEmptyState from '@/shared/components/reusable/SectionEmptyState'

interface Props {
  latest?: UpdateComic[]
  initialResponse?: APIResponse<UpdateComic[]>
}

function LatestCardSkeleton() {
  return (
    <div className="flex gap-3.5 p-3 sm:p-3.5 rounded-2xl bg-[#0e1422] border border-white/5 w-full animate-pulse">
      <div className="w-24 sm:w-28 aspect-[3/4.2] rounded-xl bg-slate-800 shrink-0" />
      <div className="flex flex-col flex-1 gap-2.5 py-1 justify-between">
        <div className="h-4 sm:h-5 w-4/5 bg-slate-800 rounded" />
        <div className="flex flex-col gap-1.5 mt-2">
          <div className="h-8 w-full bg-slate-800/60 rounded-lg" />
          <div className="h-8 w-full bg-slate-800/60 rounded-lg" />
          <div className="h-8 w-full bg-slate-800/60 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export default function LatestSection({ latest, initialResponse }: Props) {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState<'project' | 'mirror'>('project')

  // Construct initial query data from props
  const defaultResponse: APIResponse<UpdateComic[]> = initialResponse || {
    data: latest || [],
    meta: {
      total: latest?.length || 0,
      total_page: 1,
      page: 1,
      page_size: 10,
    },
  }

  const { data: updateData, isPending, refetch } = useGetUpdateManga(
    defaultResponse,
    selectedType,
    1,
    10
  )

  const items = updateData?.data || (selectedType === 'project' ? latest || [] : [])

  return (
    <section className="flex flex-col w-full gap-3.5 p-1">
      {/* Header dengan Tab Switcher Project vs Mirror */}
      <header className="flex items-center justify-between w-full pb-2.5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <LucideTimer className="w-5 h-5 text-primary" />
          <span className="text-white font-bold text-lg font-heading tracking-wide">
            Update Terbaru
          </span>
        </div>

        {/* Switcher Tab Pill */}
        <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/5 text-xs">
          <button
            type="button"
            onClick={() => setSelectedType('project')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
              selectedType === 'project'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Project
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('mirror')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
              selectedType === 'mirror'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mirror
          </button>
        </div>
      </header>

      {/* List Komik Terbaru (Max 10 Items) */}
      <div className="w-full flex flex-col gap-3 min-h-[400px]">
        {isPending && items.length === 0 ? (
          Array.from({ length: 10 }).map((_, i) => (
            <LatestCardSkeleton key={i} />
          ))
        ) : items.length > 0 ? (
          items.slice(0, 10).map((data, i) => (
            <LatestCard key={data.manga_id || i} data={data} index={i} />
          ))
        ) : (
          <SectionEmptyState
            size="sm"
            className="my-auto py-8"
            title={`Update ${selectedType === 'project' ? 'Project' : 'Mirror'} Kosong`}
            message="Belum ada update chapter komik terbaru untuk kategori ini."
            onRetry={() => refetch()}
          />
        )}
      </div>

      {/* Button Selengkapnya */}
      <Button
        onClick={() => navigate({ to: '/update' })}
        className="mt-2 flex items-center justify-center w-full bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold py-2.5 rounded-xl transition-all cursor-pointer"
      >
        Selengkapnya &gt;
      </Button>
    </section>
  )
}
