import { useState, useMemo } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Tag,
  Search,
  Compass,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react'
import { getH18GenreList } from '@/api/server/h18'
import { useH18Auth } from '@/features/h18/hooks/useH18Auth'
import H18LockedGate from '@/features/h18/components/H18LockedGate'

export const Route = createFileRoute('/h-genre')({
  loader: async () => {
    try {
      const categories = await getH18GenreList()
      return { categories: categories || [] }
    } catch {
      return { categories: [] }
    }
  },
  component: H18GenreIndexPage,
})

const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const ITEMS_PER_PAGE = 30

function H18GenreIndexPage() {
  const { categories } = Route.useLoaderData()
  const { isAuthenticated } = useH18Auth()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)

  if (!isAuthenticated) {
    return <H18LockedGate onSuccess={() => window.location.reload()} />
  }

  // Flatten all tags uniquely for global searching and alphabetical pagination
  const allTags = useMemo(() => {
    const map = new Map<string, { name: string; slug: string; count: string; category: string }>()
    categories.forEach((cat) => {
      cat.tags.forEach((t) => {
        if (!map.has(t.slug)) {
          map.set(t.slug, { ...t, category: cat.category })
        }
      })
    })
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [categories])

  // Filter pipeline:
  // 1. If searching: search across all tags matching the query
  // 2. If not searching: filter by activeCategoryTab and selectedLetter
  const filteredTags = useMemo(() => {
    const q = searchQuery.trim().toLowerCase().replace(/^#/, '')

    if (q) {
      // Global search across all tags
      return allTags.filter((t) => {
        const matchesQuery = t.name.toLowerCase().includes(q) || t.slug.includes(q)
        const matchesCategory = activeCategoryTab === 'all' || t.category === activeCategoryTab
        return matchesQuery && matchesCategory
      })
    }

    return allTags.filter((t) => {
      const matchesCategory = activeCategoryTab === 'all' || t.category === activeCategoryTab
      const matchesLetter = !selectedLetter || t.name.toUpperCase().startsWith(selectedLetter)
      return matchesCategory && matchesLetter
    })
  }, [allTags, searchQuery, selectedLetter, activeCategoryTab])

  // Pagination calculation
  const totalItems = filteredTags.length
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)

  const paginatedTags = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE
    return filteredTags.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredTags, safeCurrentPage])

  const handleLetterClick = (letter: string | null) => {
    setSelectedLetter(letter)
    setSearchQuery('')
    setCurrentPage(1)
  }

  const handleCategoryChange = (catName: string) => {
    setActiveCategoryTab(catName)
    setCurrentPage(1)
  }

  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    setCurrentPage(1)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setCurrentPage(newPage)
    const gridEl = document.getElementById('genre-grid-top')
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedLetter(null)
    setActiveCategoryTab('all')
    setCurrentPage(1)
  }

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
                <span>Daftar Genre &amp; Tag H18</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#ff2d78] text-white font-black">
                  #TAGS
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Jelajahi ratusan kategori, tema cerita, dan fetish komik dewasa terindeks A-Z dengan paginasi.
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

        {/* 2. Search & Controls Container */}
        <div className="flex flex-col gap-4 p-4 rounded-2xl bg-[#110a17] border border-white/10 shadow-lg">
          {/* Search Input */}
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari semua genre atau tag langsung... (misal: #sole-female, #romance, #maid, #frieren)"
              className="w-full h-11 bg-black/60 border border-white/15 focus:border-[#ff2d78] rounded-xl pl-10 pr-9 text-xs sm:text-sm text-white outline-none transition-colors placeholder:text-slate-500 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleCategoryChange('all')}
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
                onClick={() => handleCategoryChange(cat.category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCategoryTab === cat.category
                    ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/40'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat.category} ({cat.tags.length})
              </button>
            ))}
          </div>

          {/* Alphabet Index Filter Bar (A-Z) with Quick Selection */}
          <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={() => handleLetterClick(null)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedLetter === null && !searchQuery
                  ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              SEMUA (A-Z)
            </button>
            {ALPHABETS.map((letter) => {
              const countForLetter = allTags.filter((t) =>
                t.name.toUpperCase().startsWith(letter)
              ).length
              const isSelected = selectedLetter === letter && !searchQuery

              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => handleLetterClick(isSelected ? null : letter)}
                  title={`Huruf ${letter} (${countForLetter} tag)`}
                  className={`min-w-7 h-7 px-1 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/40 font-extrabold'
                      : countForLetter > 0
                        ? 'text-slate-300 hover:text-white hover:bg-white/10'
                        : 'text-slate-600 hover:text-slate-400 hover:bg-white/5'
                  }`}
                >
                  {letter}
                </button>
              )
            })}
          </div>
        </div>

        {/* 3. Status Bar: Active Filter & Count */}
        <div id="genre-grid-top" className="flex items-center justify-between text-xs text-slate-400 px-1 scroll-mt-24">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff2d78]" />
            {searchQuery ? (
              <span>
                Hasil pencarian untuk &quot;<strong className="text-[#ff2d78]">{searchQuery}</strong>&quot;: <strong>{totalItems}</strong> genre
              </span>
            ) : selectedLetter ? (
              <span>
                Genre dengan awalan huruf <strong className="text-[#ff2d78]">{selectedLetter}</strong>: <strong>{totalItems}</strong> genre
              </span>
            ) : (
              <span>
                Menampilkan <strong>{totalItems}</strong> genre total
              </span>
            )}
          </div>

          {totalPages > 1 && (
            <span className="font-medium text-slate-500">
              Halaman <strong className="text-white">{safeCurrentPage}</strong> dari {totalPages}
            </span>
          )}
        </div>

        {/* 4. Paginated Genre Cards Grid */}
        {paginatedTags.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
              {paginatedTags.map((tag) => (
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
                    <span className="text-[10px] text-slate-500 truncate">
                      {tag.category}
                    </span>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-white/5 group-hover:bg-[#ff2d78]/20 text-[10px] font-semibold text-slate-400 group-hover:text-[#ff2d78] transition-colors border border-white/5">
                    {tag.count}
                  </span>
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  type="button"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => handlePageChange(safeCurrentPage - 1)}
                  className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#120a17] border border-white/10 text-xs font-bold text-slate-300 hover:text-white hover:border-[#ff2d78] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>

                {/* Page Indicators */}
                <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const p = idx + 1
                    // Only show first, last, and pages close to current
                    if (
                      p === 1 ||
                      p === totalPages ||
                      (p >= safeCurrentPage - 2 && p <= safeCurrentPage + 2)
                    ) {
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handlePageChange(p)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                            safeCurrentPage === p
                              ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/40'
                              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    } else if (
                      p === safeCurrentPage - 3 ||
                      p === safeCurrentPage + 3
                    ) {
                      return (
                        <span key={p} className="text-slate-600 px-1 text-xs">
                          ...
                        </span>
                      )
                    }
                    return null
                  })}
                </div>

                <button
                  type="button"
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => handlePageChange(safeCurrentPage + 1)}
                  className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#120a17] border border-white/10 text-xs font-bold text-slate-300 hover:text-white hover:border-[#ff2d78] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#ff2d78]/15 border border-[#ff2d78] text-[#ff2d78] flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-white">Tidak Ada Genre Ditemukan</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
              Tidak ditemukan genre yang cocok dengan kata kunci &quot;{searchQuery}&quot; atau huruf {selectedLetter}.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-[#ff2d78] text-white text-xs font-bold cursor-pointer hover:bg-[#e02068] transition-colors"
            >
              Reset Filter Pencarian
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
