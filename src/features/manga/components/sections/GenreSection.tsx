import { useState, useRef } from 'react'
import { trpcClient } from '@/integrations/tanstack-query/root-provider'
import type { ComicType } from '@/shared/interfaces'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Compass } from 'lucide-react'
import GenreComicCard from '@/features/manga/components/cards/GenreComicCard'
import SectionEmptyState from '@/shared/components/reusable/SectionEmptyState'

const POPULAR_GENRES = [
  { name: 'Action', slug: 'action' },
  { name: 'Romance', slug: 'romance' },
  { name: 'Fantasy', slug: 'fantasy' },
  { name: 'Comedy', slug: 'comedy' },
  { name: 'Adventure', slug: 'adventure' },
  { name: 'Isekai', slug: 'isekai' },
  { name: 'Drama', slug: 'drama' },
  { name: 'Supernatural', slug: 'supernatural' },
  { name: 'Mystery', slug: 'mystery' },
  { name: 'Sci-Fi', slug: 'sci-fi' },
  { name: 'Slice of Life', slug: 'slice-of-life' },
]

function GenreCardSkeleton() {
  return (
    <div className="flex flex-col w-full gap-2 animate-pulse">
      <div className="w-full aspect-[3/4.2] rounded-xl bg-slate-800/80" />
      <div className="h-4 w-4/5 bg-slate-800/80 rounded" />
    </div>
  )
}

export default function GenreSection() {
  const [selectedGenre, setSelectedGenre] = useState('action')
  const pillRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})

  const { data, isPending, refetch } = useQuery({
    queryKey: ['genre-preview-home', selectedGenre],
    queryFn: async () => {
      const res = await trpcClient.manga.getComicByGenres.query({
        genres: [selectedGenre],
        pageSize: 12,
        page: 1,
      })
      return (res?.data as ComicType[]) || []
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })

  const comics = data || []

  const handleSelectGenre = (slug: string) => {
    setSelectedGenre(slug)
    const element = pillRefs.current[slug]
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }

  return (
    <section className="flex flex-col w-full gap-5 text-white">
      {/* Header */}
      <header className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-primary" />
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
            Jelajahi Genre
          </h2>
        </div>
        <Link
          to="/explore"
          search={{ genre: selectedGenre }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 text-slate-200 hover:text-white rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm"
        >
          Lihat Semua &gt;
        </Link>
      </header>

      {/* Genre Pills Bar (Horizontal Scrollable with auto-center on select) */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {POPULAR_GENRES.map((g) => {
          const isActive = selectedGenre === g.slug
          return (
            <button
              key={g.slug}
              ref={(el) => {
                pillRefs.current[g.slug] = el
              }}
              type="button"
              onClick={() => handleSelectGenre(g.slug)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none ${
                isActive
                  ? 'bg-primary text-white shadow-sm shadow-primary/30'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              {g.name}
            </button>
          )
        })}
      </div>

      {/* Comic Preview Grid (2 cols mobile, 3 cols sm, up to 6 cols on xl) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 w-full min-h-[300px]">
        {isPending && comics.length === 0 ? (
          Array.from({ length: 12 }).map((_, i) => (
            <GenreCardSkeleton key={i} />
          ))
        ) : comics.length > 0 ? (
          comics.slice(0, 12).map((comic, i) => (
            <GenreComicCard key={comic.manga_id || i} data={comic} index={i} />
          ))
        ) : (
          <div className="col-span-full py-6">
            <SectionEmptyState
              title={`Komik Genre "${POPULAR_GENRES.find((g) => g.slug === selectedGenre)?.name || selectedGenre}" Belum Tersedia`}
              message="Belum ada daftar komik untuk genre yang dipilih saat ini."
              onRetry={() => refetch()}
            />
          </div>
        )}
      </div>
    </section>
  )
}
