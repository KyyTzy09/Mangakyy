import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { Flame, Sparkles, Compass } from 'lucide-react'
import { z } from 'zod'
import { getH18List } from '@/api/server/h18'
import { useH18Auth } from '@/features/h18/hooks/useH18Auth'
import H18LockedGate from '@/features/h18/components/H18LockedGate'
import H18Carousel from '@/features/h18/components/H18Carousel'
import H18Card from '@/features/h18/components/H18Card'

const searchSchema = z.object({
  sort: z.enum(['recent', 'popular']).optional().default('recent'),
})

export const Route = createFileRoute('/h18')({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search: { sort } }) => ({ sort }),
  loader: async ({ deps: { sort } }) => {
    try {
      const res = await getH18List({ data: { query: '', page: 1, sort } })
      return { data: res }
    } catch {
      return { data: { books: [], total_pages: 1, current_page: 1, per_page: 0 } }
    }
  },
  component: H18HomePage,
})

function H18HomePage() {
  const { data } = Route.useLoaderData()
  const { sort } = Route.useSearch()
  const { isAuthenticated } = useH18Auth()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    return <H18LockedGate onSuccess={() => window.location.reload()} />
  }

  const books = data?.books || []
  const activeSort = sort || 'recent'

  const handleTabChange = (newSort: 'recent' | 'popular') => {
    navigate({
      to: '/h18',
      search: { sort: newSort },
    })
  }

  return (
    <main className="relative flex flex-col items-center justify-start min-h-screen bg-[#08050a] text-slate-100 overflow-x-hidden pb-20">
      {/* 1. Hero Carousel in Solid Pink Style */}
      {books.length > 0 && <H18Carousel items={books} />}

      {/* 2. Main Content Catalog Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8 flex flex-col gap-6">
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff2d78] text-white flex items-center justify-center shadow-lg shadow-[#ff2d78]/30">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight flex items-center gap-2">
                <span>Katalog Mode H18</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#ff2d78] text-white font-black">
                  18+
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Koleksi komik dewasa eksklusif dengan pengalaman baca mulus.
              </p>
            </div>
          </div>

          {/* Right Action: Tabs Switcher & Link to Explore */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Tab Pill Switcher (Semua vs Populer) */}
            <div className="flex items-center gap-1 bg-[#140c19] border border-white/10 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => handleTabChange('recent')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSort === 'recent'
                    ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('popular')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSort === 'popular'
                    ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Populer
              </button>
            </div>

            {/* Quick Explore Link */}
            <Link
              to="/h-explore"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-[#ff2d78]/20 border border-white/10 hover:border-[#ff2d78]/40 text-xs font-bold text-slate-300 hover:text-white transition-all shadow-sm"
            >
              <Compass className="w-3.5 h-3.5 text-[#ff2d78]" />
              <span>Explore &gt;</span>
            </Link>
          </div>
        </div>

        {/* 3. Comic Cards Grid */}
        {books.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {books.map((comic, index) => (
              <H18Card key={comic.id} data={comic} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#ff2d78]/15 border border-[#ff2d78] text-[#ff2d78] flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-white">Belum Ada Komik Ditemukan</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
              Gunakan fitur Explore untuk menjelajahi berbagai genre dan kategori.
            </p>
            <Link
              to="/h-explore"
              className="px-4 py-2 rounded-xl bg-[#ff2d78] text-white text-xs font-bold cursor-pointer hover:bg-[#e02068] transition-colors"
            >
              Buka Halaman Explore
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
