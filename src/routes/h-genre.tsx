import { useState, useMemo } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Tag, Search, Compass, Sparkles, X } from 'lucide-react'
import { getH18GenreList } from '@/api/server/h18'
import { useH18Auth } from '@/features/h18/hooks/useH18Auth'
import H18LockedGate from '@/features/h18/components/H18LockedGate'

export const Route = createFileRoute('/h-genre')({
  loader: async () => {
    try {
      const categories = await getH18GenreList()
      return { categories }
    } catch {
      return { categories: [] }
    }
  },
  component: H18GenreIndexPage,
})

const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function H18GenreIndexPage() {
  const { categories } = Route.useLoaderData()
  const { isAuthenticated } = useH18Auth()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('all')

  if (!isAuthenticated) {
    return <H18LockedGate onSuccess={() => window.location.reload()} />
  }

  // Flatten all tags for search & alphabetical view
  const allTags = useMemo(() => {
    const map = new Map<string, { name: string; slug: string; count: string; category: string }>()
    categories.forEach((cat) => {
      cat.tags.forEach((t) => {
        if (!map.has(t.slug)) {
          map.set(t.slug, { ...t, category: cat.category })
        }
      })
    })
    return Array.from(map.values())
  }, [categories])

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase().replace(/^#/, '')

    return categories
      .map((cat) => {
        if (activeCategoryTab !== 'all' && cat.category !== activeCategoryTab) {
          return null
        }

        const tags = cat.tags.filter((t) => {
          const matchQuery = !q || t.name.toLowerCase().includes(q) || t.slug.includes(q)
          const matchLetter = !selectedLetter || t.name.toUpperCase().startsWith(selectedLetter)
          return matchQuery && matchLetter
        })

        if (tags.length === 0) return null
        return {
          ...cat,
          tags,
        }
      })
      .filter(Boolean) as typeof categories
  }, [categories, searchQuery, selectedLetter, activeCategoryTab])

  const totalFilteredCount = filteredCategories.reduce((acc, cat) => acc + cat.tags.length, 0)

  return (
    <main className="relative flex flex-col items-center justify-start min-h-screen bg-[#08050a] text-slate-100 overflow-x-hidden pt-22 pb-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-6">
        {/* 1. Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff2d78] text-white flex items-center justify-center shadow-lg shadow-[#ff2d78]/30">
              <Tag className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight flex items-center gap-2">
                <span>Daftar Genre & Tag H18</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#ff2d78] text-white font-black">
                  #TAGS
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Jelajahi ratusan kategori dan tema komik dewasa dengan mudah.
              </p>
            </div>
          </div>

          {/* Quick link to Explore */}
          <Link
            to="/h-explore"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-[#ff2d78]/20 border border-white/10 hover:border-[#ff2d78]/40 text-xs font-bold text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <Compass className="w-4 h-4 text-[#ff2d78]" />
            <span>Ke Halaman Explore</span>
          </Link>
        </div>

        {/* 2. Search & Category Tabs Control */}
        <div className="flex flex-col gap-4 p-4 rounded-2xl bg-[#110a17] border border-white/10">
          {/* Search Input in MangaKyy Style */}
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari genre atau tag... (misal: #sole-female, #romance, #maid)"
              className="w-full h-11 bg-black/60 border border-white/15 focus:border-[#ff2d78] rounded-xl pl-10 pr-9 text-xs sm:text-sm text-white outline-none transition-colors placeholder:text-slate-500 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills in MangaKyy Style */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCategoryTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategoryTab === 'all'
                  ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/40'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              Semua Kategori ({allTags.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.category}
                type="button"
                onClick={() => setActiveCategoryTab(cat.category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCategoryTab === cat.category
                    ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/40'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>

          {/* Alphabet Index Filter Bar (A-Z) */}
          <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={() => setSelectedLetter(null)}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                selectedLetter === null
                  ? 'bg-[#ff2d78] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              ALL
            </button>
            {ALPHABETS.map((letter) => (
              <button
                key={letter}
                type="button"
                onClick={() => setSelectedLetter(selectedLetter === letter ? null : letter)}
                className={`w-7 h-7 rounded flex items-center justify-center text-[11px] font-bold transition-all cursor-pointer ${
                  selectedLetter === letter
                    ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Grouped Genre Cards Grid */}
        {totalFilteredCount > 0 ? (
          <div className="flex flex-col gap-8">
            {filteredCategories.map((group) => (
              <section key={group.category} className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between border-b border-white/10 pb-2">
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ff2d78]" />
                    <span>{group.category}</span>
                  </h2>
                  <span className="text-xs text-slate-400">{group.tags.length} Genre</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
                  {group.tags.map((tag) => (
                    <Link
                      key={tag.slug}
                      to="/h-genre-detail/$genre"
                      params={{ genre: tag.slug }}
                      className="group flex items-center justify-between p-3 rounded-xl bg-[#120a18] hover:bg-[#1a0f22] border border-white/10 hover:border-[#ff2d78] transition-all cursor-pointer shadow-sm hover:shadow-md hover:shadow-[#ff2d78]/20"
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-[#ff2d78] transition-colors truncate">
                          #{tag.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {tag.slug}
                        </span>
                      </div>
                      <span className="shrink-0 px-2 py-0.5 rounded-full bg-white/5 group-hover:bg-[#ff2d78]/20 text-[10px] font-semibold text-slate-400 group-hover:text-[#ff2d78] transition-colors border border-white/5">
                        {tag.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#ff2d78]/15 border border-[#ff2d78] text-[#ff2d78] flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-white">Tidak Ada Genre Ditemukan</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
              Coba kata kunci lain atau reset filter alfabet.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setSelectedLetter(null)
                setActiveCategoryTab('all')
              }}
              className="px-4 py-2 rounded-xl bg-[#ff2d78] text-white text-xs font-bold cursor-pointer hover:bg-[#e02068] transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </main>
  )
}