import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Search, Flame, Sparkles } from 'lucide-react'
import { getH18List } from '@/api/server/h18'
import H18Carousel from '@/features/h18/components/H18Carousel'
import H18Card from '@/features/h18/components/H18Card'

export const Route = createFileRoute('/h18/')({
  loader: async () => {
    try {
      const res = await getH18List({ data: { query: '', page: 1, sort: 'recent' } })
      return { data: res }
    } catch {
      return { data: { books: [], total_pages: 1, current_page: 1, per_page: 0 } }
    }
  },
  component: H18HomePage,
})

function H18HomePage() {
  const { data } = Route.useLoaderData()
  const [activeTab, setActiveTab] = useState<'all' | 'popular'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const books = data?.books || []
  const filteredBooks = searchQuery
    ? books.filter(
        (b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.tags.some((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : books

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

          {/* Right Action: Search Bar & Tabs */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari komik / tag H18..."
                className="w-full h-10 bg-black/60 border border-white/15 focus:border-[#ff2d78] rounded-xl pl-9 pr-4 text-xs sm:text-sm text-white outline-none transition-colors placeholder:text-slate-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Tab Pill Switcher */}
            <div className="flex items-center gap-1 bg-[#140c19] border border-white/10 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('popular')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'popular'
                    ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Populer
              </button>
            </div>
          </div>
        </div>

        {/* 3. Comic Cards Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {filteredBooks.map((comic, index) => (
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
              Coba gunakan kata kunci pencarian lain atau kembali ke daftar utama.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 rounded-xl bg-[#ff2d78] text-white text-xs font-bold cursor-pointer hover:bg-[#e02068] transition-colors"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
