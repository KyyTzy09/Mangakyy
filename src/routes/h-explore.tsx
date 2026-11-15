import { useState, useRef, useEffect, useMemo } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import {
  Search,
  Compass,
  ArrowLeft,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Tag,
  Check,
} from 'lucide-react'
import { z } from 'zod'
import { getH18List, getH18GenreList } from '@/api/server/h18'
import { useH18Auth } from '@/features/h18/hooks/useH18Auth'
import H18LockedGate from '@/features/h18/components/H18LockedGate'
import H18Card from '@/features/h18/components/H18Card'

const exploreSearchSchema = z.object({
  q: z.string().optional().default(''),
  category: z.string().optional(),
  language: z.string().optional(),
  tag: z.string().optional(),
  artist: z.string().optional(),
  theme: z.string().optional(),
  sort: z
    .enum(['recent', 'popular', 'popular-today', 'popular-week', 'popular-month'])
    .optional()
    .default('popular'),
  page: z.number().optional().default(1),
})

export const Route = createFileRoute('/h-explore')({
  validateSearch: (search) => exploreSearchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    try {
      const cleanTag = deps.tag ? deps.tag.replace(/^#/, '').replace(/-/g, ' ') : undefined
      const tagsList: string[] = []
      if (cleanTag) tagsList.push(cleanTag)
      if (deps.theme) tagsList.push(deps.theme.replace(/-/g, ' '))

      const [res, categories] = await Promise.all([
        getH18List({
          data: {
            query: deps.q || '',
            category: deps.category,
            language: deps.language,
            tags: tagsList.length > 0 ? tagsList : undefined,
            artist: deps.artist,
            sort: deps.sort,
            page: deps.page,
          },
        }),
        getH18GenreList(),
      ])

      return {
        data: res,
        categories: categories || [],
      }
    } catch {
      return {
        data: { books: [], total_pages: 1, current_page: 1, per_page: 0 },
        categories: [],
      }
    }
  },
  component: H18ExplorePage,
})

const CATEGORIES = [
  { label: 'Semua Kategori', value: '' },
  { label: 'Doujinshi', value: 'doujinshi' },
  { label: 'Manga', value: 'manga' },
  { label: 'Artist CG', value: 'artist-cg' },
  { label: 'Game CG', value: 'game-cg' },
]

const LANGUAGES = [
  { label: 'Semua Bahasa', value: '' },
  { label: 'English', value: 'english' },
  { label: 'Japanese', value: 'japanese' },
  { label: 'Chinese', value: 'chinese' },
  { label: 'Translated', value: 'translated' },
]

const SORT_OPTIONS = [
  { label: 'Terpopuler', value: 'popular' },
  { label: 'Hari Ini', value: 'popular-today' },
  { label: 'Minggu Ini', value: 'popular-week' },
  { label: 'Bulan Ini', value: 'popular-month' },
  { label: 'Terbaru', value: 'recent' },
]

const CREATOR_OPTIONS = [
  { label: 'Semua Kreator', value: '' },
  { label: 'Mizuryu Kei', value: 'mizuryu-kei' },
  { label: 'Shindo L', value: 'shindo-l' },
  { label: 'Hisasi', value: 'hisasi' },
  { label: 'Asagi Ryu', value: 'asagi-ryu' },
  { label: 'Homunculus', value: 'homunculus' },
  { label: 'MEME50', value: 'meme50' },
  { label: 'Distance', value: 'distance' },
  { label: 'Bosshi', value: 'bosshi' },
  { label: 'Kisaragi Gunma', value: 'kisaragi-gunma' },
  { label: 'Kurogane Ken', value: 'kurogane-ken' },
  { label: 'Po-Ju', value: 'po-ju' },
  { label: 'ReDrop', value: 'redrop' },
  { label: 'Tachibana Omina', value: 'tachibana-omina' },
  { label: 'Tony Taka', value: 'tony-taka' },
]

const THEME_OPTIONS = [
  { label: 'Semua Tema', value: '' },
  { label: 'Komedi', value: 'comedy' },
  { label: 'Romance', value: 'romance' },
  { label: 'Harem', value: 'harem' },
  { label: 'Fantasy', value: 'fantasy' },
  { label: 'Supernatural', value: 'supernatural' },
  { label: 'Drama', value: 'drama' },
  { label: 'Slice of Life', value: 'slice-of-life' },
  { label: 'Action', value: 'action' },
  { label: 'Psychological', value: 'psychological' },
  { label: 'Isekai', value: 'isekai' },
  { label: 'Horror', value: 'horror' },
  { label: 'Sci-Fi', value: 'sci-fi' },
  { label: 'Mystery', value: 'mystery' },
]

const POPULAR_TAGS = [
  { label: '#sole-female', value: 'sole-female' },
  { label: '#sole-male', value: 'sole-male' },
  { label: '#romance', value: 'romance' },
  { label: '#comedy', value: 'comedy' },
  { label: '#big-breasts', value: 'big-breasts' },
  { label: '#schoolgirl', value: 'schoolgirl' },
  { label: '#maid', value: 'maid' },
  { label: '#nakadashi', value: 'nakadashi' },
  { label: '#group', value: 'group' },
  { label: '#vanilla', value: 'vanilla' },
  { label: '#full-color', value: 'full-color' },
  { label: '#milf', value: 'milf' },
  { label: '#glasses', value: 'glasses' },
]

interface CustomSelectorProps<T extends string> {
  label: string
  value: T
  options: { label: string; value: T }[]
  onChange: (val: T) => void
}

function MangaKyyCustomSelector<T extends string>({
  label,
  value,
  options,
  onChange,
}: CustomSelectorProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentOption = options.find((opt) => opt.value === value) || options[0]

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full h-11 px-3.5 bg-black/60 hover:bg-black/80 border border-white/15 hover:border-[#ff2d78]/60 focus:border-[#ff2d78] rounded-xl flex items-center justify-between text-xs sm:text-sm text-white transition-all cursor-pointer shadow-sm group"
      >
        <div className="flex items-center gap-2 truncate">
          <span className="text-[11px] text-slate-400 font-medium">{label}:</span>
          <span className="font-bold text-white group-hover:text-[#ff2d78] transition-colors truncate">
            {currentOption.label}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-[#ff2d78]' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 p-1.5 rounded-xl bg-[#140c19] border border-[#ff2d78]/40 backdrop-blur-2xl shadow-2xl z-40 flex flex-col gap-1 max-h-60 overflow-y-auto">
          {options.map((opt) => {
            const isSelected = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value)
                  setIsOpen(false)
                }}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-2" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function H18ExplorePage() {
  const { data, categories } = Route.useLoaderData()
  const search = Route.useSearch()
  const { isAuthenticated } = useH18Auth()
  const navigate = useNavigate()

  const [inputQuery, setInputQuery] = useState(
    search.tag ? `#${search.tag}` : search.q || ''
  )
  const [debouncedTagTerm, setDebouncedTagTerm] = useState<string | null>(null)
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Flatten all tags for autocomplete
  const allFlattenedTags = useMemo(() => {
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

  // Debounce the # tag search term
  useEffect(() => {
    const hashIndex = inputQuery.lastIndexOf('#')
    if (hashIndex !== -1) {
      const rawTerm = inputQuery.slice(hashIndex + 1).trim().toLowerCase()
      const timer = setTimeout(() => {
        setDebouncedTagTerm(rawTerm)
        setIsSuggestionOpen(true)
      }, 200)
      return () => clearTimeout(timer)
    } else {
      setDebouncedTagTerm(null)
      setIsSuggestionOpen(false)
    }
  }, [inputQuery])

  // Close suggestions on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSuggestionOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Filtered tag suggestions based on debounced term
  const suggestedTags = useMemo(() => {
    if (debouncedTagTerm === null) return []
    const term = debouncedTagTerm
    return allFlattenedTags
      .filter((t) => !term || t.name.toLowerCase().includes(term) || t.slug.includes(term))
      .slice(0, 12)
  }, [debouncedTagTerm, allFlattenedTags])

  if (!isAuthenticated) {
    return <H18LockedGate onSuccess={() => window.location.reload()} />
  }

  const books = data?.books || []
  const totalPages = data?.total_pages || 1
  const currentPage = search.page || 1

  const updateSearch = (patch: Partial<z.infer<typeof exploreSearchSchema>>) => {
    navigate({
      to: '/h-explore',
      search: {
        ...search,
        page: 1, // reset page on filter change
        ...patch,
      },
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSuggestionOpen(false)
    const trimmed = inputQuery.trim()

    // If user searched for #tag, extract as tag filter
    if (trimmed.startsWith('#')) {
      const tagSlug = trimmed.slice(1).toLowerCase().replace(/\s+/g, '-')
      updateSearch({ q: '', tag: tagSlug })
    } else {
      updateSearch({ q: trimmed, tag: undefined })
    }
  }

  const handleSelectSuggestedTag = (tag: { name: string; slug: string }) => {
    setInputQuery(`#${tag.slug}`)
    setIsSuggestionOpen(false)
    updateSearch({ tag: tag.slug, q: '' })
  }

  const handleClearFilters = () => {
    setInputQuery('')
    setIsSuggestionOpen(false)
    navigate({
      to: '/h-explore',
      search: {
        q: '',
        category: undefined,
        language: undefined,
        tag: undefined,
        artist: undefined,
        theme: undefined,
        sort: 'popular',
        page: 1,
      },
    })
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    navigate({
      to: '/h-explore',
      search: {
        ...search,
        page: newPage,
      },
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hasActiveFilters = Boolean(
    search.category ||
      search.language ||
      search.tag ||
      search.artist ||
      search.theme ||
      search.q ||
      search.sort !== 'popular'
  )

  return (
    <main className="relative flex flex-col items-center justify-start min-h-screen bg-[#08050a] text-slate-100 overflow-x-hidden pt-22 pb-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-6">
        {/* 1. Header & Back Link */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Link
              to="/h18"
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#ff2d78] text-white flex items-center justify-center border border-white/10 transition-colors"
              title="Kembali ke Katalog"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight flex items-center gap-2">
                <Compass className="w-6 h-6 text-[#ff2d78]" />
                <span>Explore H18</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Pencarian dan filter komik berdasarkan genre, creator, tema, bahasa, dan tag.
              </p>
            </div>
          </div>

          {/* Quick link to dedicated Genre Catalog */}
          <Link
            to="/h-genre"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-[#ff2d78]/20 border border-white/10 hover:border-[#ff2d78]/40 text-xs font-bold text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <Tag className="w-3.5 h-3.5 text-[#ff2d78]" />
            <span>Katalog Genre (#Tags) &gt;</span>
          </Link>
        </div>

        {/* 2. MangaKyy Styled Filter Controls Container */}
        <div className="flex flex-col gap-4 p-4 sm:p-5 rounded-2xl bg-[#110a17] border border-white/10 shadow-xl">
          {/* Search Bar with Debounced #Tag Autocomplete */}
          <div ref={searchContainerRef} className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <input
                type="text"
                value={inputQuery}
                onFocus={() => {
                  if (inputQuery.includes('#')) {
                    setIsSuggestionOpen(true)
                  }
                }}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Cari judul komik atau ketik #tag (misal: #comedy, #romance, #maid, #sole-female)..."
                className="w-full h-11 bg-black/60 border border-white/15 focus:border-[#ff2d78] rounded-xl pl-10 pr-9 text-xs sm:text-sm text-white outline-none transition-colors placeholder:text-slate-500 font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {inputQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setInputQuery('')
                    setIsSuggestionOpen(false)
                    updateSearch({ q: '', tag: undefined })
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Debounced # Tag Autocomplete Suggestion Dropdown */}
              {isSuggestionOpen && suggestedTags.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 p-2 rounded-2xl bg-[#140c19] border border-[#ff2d78]/40 backdrop-blur-2xl shadow-2xl z-50 flex flex-col gap-1 max-h-72 overflow-y-auto">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 text-[11px] font-bold text-slate-400">
                    <span className="flex items-center gap-1.5 text-[#ff2d78]">
                      <Tag className="w-3 h-3" />
                      <span>Rekomendasi Tag &amp; Genre (#):</span>
                    </span>
                    <span>{suggestedTags.length} ditemukan</span>
                  </div>

                  {suggestedTags.map((t) => (
                    <button
                      key={t.slug}
                      type="button"
                      onClick={() => handleSelectSuggestedTag(t)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs sm:text-sm font-bold text-[#ff2d78] group-hover:text-pink-400 truncate">
                          #{t.name}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate hidden sm:inline">
                          ({t.category})
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-semibold text-slate-400 group-hover:text-white border border-white/5 shrink-0">
                        {t.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </form>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>

          {/* Row 1: MangaKyy Styled Custom Selectors (Kategori, Bahasa, Kreator, Tema, Urutan) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            <MangaKyyCustomSelector
              label="Kategori"
              value={search.category || ''}
              options={CATEGORIES}
              onChange={(val) => updateSearch({ category: val || undefined })}
            />

            <MangaKyyCustomSelector
              label="Bahasa"
              value={search.language || ''}
              options={LANGUAGES}
              onChange={(val) => updateSearch({ language: val || undefined })}
            />

            <MangaKyyCustomSelector
              label="Kreator"
              value={search.artist || ''}
              options={CREATOR_OPTIONS}
              onChange={(val) => updateSearch({ artist: val || undefined })}
            />

            <MangaKyyCustomSelector
              label="Tema"
              value={search.theme || ''}
              options={THEME_OPTIONS}
              onChange={(val) => updateSearch({ theme: val || undefined })}
            />

            <MangaKyyCustomSelector
              label="Urutan"
              value={search.sort || 'popular'}
              options={SORT_OPTIONS}
              onChange={(val) => updateSearch({ sort: val as any })}
            />
          </div>

          {/* Row 2: Popular #Tag Filter Chips in MangaKyy Style */}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                <Tag className="w-3.5 h-3.5 text-[#ff2d78]" />
                <span>Filter Cepat Berdasarkan Genre (#tag):</span>
              </span>
              <Link to="/h-genre" className="text-[#ff2d78] hover:underline text-[11px] font-bold">
                Lihat Semua &gt;
              </Link>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {POPULAR_TAGS.map((t) => {
                const isSelected = search.tag === t.value
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => {
                      const nextTag = isSelected ? undefined : t.value
                      setInputQuery(nextTag ? `#${nextTag}` : '')
                      updateSearch({ tag: nextTag })
                    }}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/40 border border-[#ff2d78]'
                        : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-[#ff2d78]/40'
                    }`}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* 3. Comic Cards Grid */}
        {books.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {books.map((comic, index) => (
                <H18Card key={comic.id} data={comic} index={index} />
              ))}
            </div>

            {/* Pagination in MangaKyy Style */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#120a17] border border-white/10 text-xs font-bold text-slate-300 hover:text-white hover:border-[#ff2d78] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>

                <div className="flex items-center px-4 py-2 rounded-xl bg-[#120a17] border border-white/10 text-xs font-bold text-slate-300">
                  <span>
                    Hal <strong className="text-[#ff2d78]">{currentPage}</strong> dari{' '}
                    {totalPages}
                  </span>
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
            <h3 className="font-bold text-lg text-white">Tidak Ada Komik Ditemukan</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
              Coba sesuaikan kata kunci pencarian atau ubah kombinasi filter genre.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
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
