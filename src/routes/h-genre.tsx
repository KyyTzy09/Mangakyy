import { useState, useMemo, useEffect, useRef } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import {
  Tag,
  Search,
  Compass,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ArrowUpDown,
  BookOpen,
  User,
  Users,
  Tv,
} from 'lucide-react'
import { z } from 'zod'
import { getH18GenreList, getH18LiveTags, searchH18Tags } from '@/api/server/h18'
import { useH18Auth } from '@/features/h18/hooks/useH18Auth'
import H18LockedGate from '@/features/h18/components/H18LockedGate'
import type { H18TagItem } from '@/features/h18/types'

const genreSearchSchema = z.object({
  q: z.string().optional().default(''),
  type: z
    .enum(['tag', 'artist', 'parody', 'character', 'group', 'curated'])
    .optional()
    .default('tag'),
  sort: z.enum(['popular', 'name']).optional().default('popular'),
  page: z.number().optional().default(1),
})

export const Route = createFileRoute('/h-genre')({
  validateSearch: (search) => genreSearchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    try {
      const categoriesPromise = getH18GenreList()

      // Curated local taxonomy tab
      if (deps.type === 'curated') {
        const categories = await categoriesPromise
        return {
          mode: 'curated' as const,
          tags: [] as H18TagItem[],
          total: 0,
          totalPages: 1,
          currentPage: 1,
          categories: categories || [],
        }
      }

      // Live search across all 4,780+ items
      if (deps.q?.trim()) {
        const [liveSearchRes, categories] = await Promise.all([
          searchH18Tags({
            data: {
              query: deps.q.trim().replace(/^#/, ''),
              type: deps.type === 'tag' ? undefined : deps.type,
              limit: 50,
            },
          }),
          categoriesPromise,
        ])
        return {
          mode: 'search' as const,
          tags: liveSearchRes || [],
          total: (liveSearchRes || []).length,
          totalPages: 1,
          currentPage: 1,
          categories: categories || [],
        }
      }

      // Live paginated browsing with 60 items per page
      const [liveTagsRes, categories] = await Promise.all([
        getH18LiveTags({
          data: {
            type: deps.type,
            sort: deps.sort,
            page: deps.page,
            per_page: 60,
          },
        }),
        categoriesPromise,
      ])

      return {
        mode: 'browse' as const,
        tags: liveTagsRes?.tags || [],
        total: liveTagsRes?.total || 0,
        totalPages: liveTagsRes?.num_pages || 1,
        currentPage: liveTagsRes?.current_page || 1,
        categories: categories || [],
      }
    } catch {
      return {
        mode: 'browse' as const,
        tags: [] as H18TagItem[],
        total: 0,
        totalPages: 1,
        currentPage: 1,
        categories: [],
      }
    }
  },
  component: H18GenreIndexPage,
})

const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const TAG_TYPE_TABS = [
  { label: 'Genre & Tema', value: 'tag', icon: Tag, countDesc: '4.780+' },
  { label: 'Artis / Kreator', value: 'artist', icon: User, countDesc: '33.300+' },
  { label: 'Anime / Parodi', value: 'parody', icon: Tv, countDesc: '4.400+' },
  { label: 'Karakter', value: 'character', icon: Users, countDesc: '18.000+' },
  { label: 'Lingkaran / Grup', value: 'group', icon: BookOpen, countDesc: '25.300+' },
  { label: 'Kategori Pilihan', value: 'curated', icon: Sparkles, countDesc: '156' },
] as const

function formatTagCount(count: number | string): string {
  const num = typeof count === 'number' ? count : parseInt(String(count).replace(/[^0-9]/g, ''), 10) || 0
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
  return num.toLocaleString('id-ID')
}

function H18GenreIndexPage() {
  const { mode, tags, total, totalPages, currentPage, categories } = Route.useLoaderData()
  const search = Route.useSearch()
  const { isAuthenticated } = useH18Auth()
  const navigate = useNavigate()

  const [inputVal, setInputVal] = useState(search.q || '')
  const [activeCuratedCategory, setActiveCuratedCategory] = useState<string>('all')
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Keep local search input synchronized if search.q changes from URL
  useEffect(() => {
    setInputVal(search.q || '')
  }, [search.q])

  if (!isAuthenticated) {
    return <H18LockedGate onSuccess={() => window.location.reload()} />
  }

  const updateSearch = (patch: Partial<z.infer<typeof genreSearchSchema>>) => {
    navigate({
      to: '/h-genre',
      search: {
        ...search,
        page: 1,
        ...patch,
      },
    })
  }

  const handleSearchInputChange = (val: string) => {
    setInputVal(val)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    debounceTimerRef.current = setTimeout(() => {
      updateSearch({ q: val.trim() })
    }, 350)
  }

  const handleClearSearch = () => {
    setInputVal('')
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    updateSearch({ q: '' })
  }

  const handleTabChange = (typeVal: (typeof TAG_TYPE_TABS)[number]['value']) => {
    setInputVal('')
    updateSearch({ type: typeVal, q: '', page: 1 })
  }

  const handleSortToggle = (newSort: 'popular' | 'name') => {
    updateSearch({ sort: newSort, page: 1 })
  }

  const handleLetterClick = (letter: string) => {
    if (search.q === letter) {
      handleClearSearch()
    } else {
      setInputVal(letter)
      updateSearch({ q: letter, page: 1 })
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    navigate({
      to: '/h-genre',
      search: {
        ...search,
        page: newPage,
      },
    })
    const gridEl = document.getElementById('genre-grid-top')
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Curated category tags flattening
  const curatedTags = useMemo(() => {
    if (activeCuratedCategory === 'all') {
      const map = new Map<string, { name: string; slug: string; count: string; category: string }>()
      categories.forEach((cat) => {
        cat.tags.forEach((t) => {
          if (!map.has(t.slug)) {
            map.set(t.slug, { ...t, category: cat.category })
          }
        })
      })
      return Array.from(map.values())
    }
    const cat = categories.find((c) => c.category === activeCuratedCategory)
    return cat ? cat.tags.map((t) => ({ ...t, category: cat.category })) : []
  }, [categories, activeCuratedCategory])

  // Destination resolver based on tag type
  const getTagDestination = (tag: { name: string; slug: string; type?: string }) => {
    const tType = tag.type || search.type
    if (tType === 'artist') {
      return {
        to: '/h-explore' as const,
        search: { artist: tag.slug },
      }
    }
    if (tType === 'parody') {
      return {
        to: '/h-explore' as const,
        search: { q: `parody:"${tag.name}"` },
      }
    }
    if (tType === 'character') {
      return {
        to: '/h-explore' as const,
        search: { q: `character:"${tag.name}"` },
      }
    }
    if (tType === 'group') {
      return {
        to: '/h-explore' as const,
        search: { q: `group:"${tag.name}"` },
      }
    }
    return {
      to: '/h-genre-detail/$genre' as const,
      params: { genre: tag.slug },
    }
  }

  return (
    <main className="relative flex flex-col items-center justify-start min-h-screen bg-[#08050a] text-slate-100 overflow-x-hidden pt-22 pb-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-6">
        {/* 1. Clean Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff2d78] text-white flex items-center justify-center shadow-lg shadow-[#ff2d78]/30 shrink-0">
              <Tag className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight">
                Daftar Genre &amp; Tag H18
              </h1>
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

        {/* 2. Taxonomy Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {TAG_TYPE_TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = search.type === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleTabChange(tab.value)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#ff2d78] text-white border-[#ff2d78] shadow-md shadow-[#ff2d78]/30 font-extrabold'
                    : 'bg-[#120a18] text-slate-400 hover:text-white hover:bg-white/10 border-white/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#ff2d78]'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-500'
                  }`}
                >
                  {tab.countDesc}
                </span>
              </button>
            )
          })}
        </div>

        {/* 3. Search & Sorting Controls Container */}
        <div className="flex flex-col gap-4 p-4 rounded-2xl bg-[#110a17] border border-white/10 shadow-lg">
          {/* Search Input Bar with Live Debounce */}
          <div className="relative w-full">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              placeholder="Cari genre, tag, artis, atau parodi langsung... (misal: sole female, romance, maid, frieren)"
              className="w-full h-11 bg-black/60 border border-white/15 focus:border-[#ff2d78] rounded-xl pl-10 pr-9 text-xs sm:text-sm text-white outline-none transition-colors placeholder:text-slate-500 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {inputVal && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                title="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sub-controls: Curated Category Filter vs Sort Order & Alphabet Bar */}
          {search.type === 'curated' ? (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setActiveCuratedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCuratedCategory === 'all'
                    ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/40'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                Semua Kategori (156)
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => setActiveCuratedCategory(cat.category)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeCuratedCategory === cat.category
                      ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/40'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat.category} ({cat.tags.length})
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-white/5">
              {/* Sort Toggle */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  Urutkan:
                </span>
                <button
                  type="button"
                  onClick={() => handleSortToggle('popular')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    search.sort === 'popular'
                      ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/30 font-extrabold'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Terpopuler
                </button>
                <button
                  type="button"
                  onClick={() => handleSortToggle('name')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    search.sort === 'name'
                      ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/30 font-extrabold'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Alfabetis (A-Z)
                </button>
              </div>

              {/* Alphabet Index Filter Bar (A-Z) */}
              <div className="flex flex-wrap items-center gap-0.5 sm:gap-1">
                {ALPHABETS.map((letter) => {
                  const isSelected = search.q.toUpperCase() === letter
                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => handleLetterClick(letter)}
                      title={`Filter awalan ${letter}`}
                      className={`min-w-6.5 h-6.5 px-1 rounded-md flex items-center justify-center text-[11px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/40 font-extrabold'
                          : 'text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {letter}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* 4. Status Bar: Active Filter & Count */}
        <div
          id="genre-grid-top"
          className="flex items-center justify-between text-xs text-slate-400 px-1 scroll-mt-24"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff2d78]" />
            {mode === 'search' ? (
              <span>
                Hasil pencarian untuk &quot;<strong className="text-[#ff2d78]">{search.q}</strong>
                &quot;: <strong>{tags.length}</strong> ditemukan
              </span>
            ) : search.type === 'curated' ? (
              <span>
                Menampilkan <strong>{curatedTags.length}</strong> kategori pilihan
              </span>
            ) : (
              <span>
                Total <strong>{total.toLocaleString('id-ID')}</strong> item terindeks (Halaman{' '}
                <strong className="text-white">{currentPage}</strong> dari {totalPages})
              </span>
            )}
          </div>

          {mode === 'browse' && totalPages > 1 && (
            <span className="font-medium text-slate-500">
              Halaman <strong className="text-white">{currentPage}</strong> dari {totalPages}
            </span>
          )}
        </div>

        {/* 5. Paginated Live Cards Grid */}
        {search.type === 'curated' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
            {curatedTags.map((tag) => (
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
                  <span className="text-[10px] text-slate-500 truncate">{tag.category}</span>
                </div>
                <span className="shrink-0 px-2 py-0.5 rounded-full bg-white/5 group-hover:bg-[#ff2d78]/20 text-[10px] font-semibold text-slate-400 group-hover:text-[#ff2d78] transition-colors border border-white/5">
                  {tag.count}
                </span>
              </Link>
            ))}
          </div>
        ) : tags.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
              {tags.map((tag) => {
                const dest = getTagDestination(tag)
                return (
                  <Link
                    key={`${tag.type}-${tag.id}-${tag.slug}`}
                    {...dest}
                    className="group flex items-center justify-between p-3 rounded-xl bg-[#120a18] hover:bg-[#1a0f22] border border-white/10 hover:border-[#ff2d78] transition-all cursor-pointer shadow-sm hover:shadow-md hover:shadow-[#ff2d78]/20"
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-[#ff2d78] transition-colors truncate">
                        #{tag.name}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold truncate">
                        {tag.type || search.type}
                      </span>
                    </div>
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-white/5 group-hover:bg-[#ff2d78]/20 text-[10px] font-semibold text-slate-400 group-hover:text-[#ff2d78] transition-colors border border-white/5">
                      {formatTagCount(tag.count)}
                    </span>
                  </Link>
                )
              })}
            </div>

            {/* Pagination Controls for Live Browsing */}
            {mode === 'browse' && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#120a17] border border-white/10 text-xs font-bold text-slate-300 hover:text-white hover:border-[#ff2d78] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>

                {/* Page Indicators */}
                <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const p = idx + 1
                    if (
                      p === 1 ||
                      p === totalPages ||
                      (p >= currentPage - 2 && p <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handlePageChange(p)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                            currentPage === p
                              ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/40'
                              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    } else if (p === currentPage - 3 || p === currentPage + 3) {
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
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
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
              Tidak ditemukan genre atau tag yang cocok dengan kata kunci &quot;{search.q}&quot;.
            </p>
            <button
              type="button"
              onClick={handleClearSearch}
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
