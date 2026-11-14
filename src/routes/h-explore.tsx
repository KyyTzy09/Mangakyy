import { useState } from 'react'
import { createFileRoute, redirect, useNavigate, Link } from '@tanstack/react-router'
import { Search, Compass, ArrowLeft, Filter, Sparkles, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { z } from 'zod'
import { getClientCookie } from '@/shared/utils/cookie'
import { H18_COOKIE_NAME, getH18List } from '@/api/server/h18'
import { useH18Auth } from '@/features/h18/hooks/useH18Auth'
import H18LockedGate from '@/features/h18/components/H18LockedGate'
import H18Card from '@/features/h18/components/H18Card'

const exploreSearchSchema = z.object({
  q: z.string().optional().default(''),
  category: z.string().optional(),
  language: z.string().optional(),
  tag: z.string().optional(),
  sort: z
    .enum(['recent', 'popular', 'popular-today', 'popular-week', 'popular-month'])
    .optional()
    .default('popular'),
  page: z.number().optional().default(1),
})

export const Route = createFileRoute('/h-explore')({
  validateSearch: (search) => exploreSearchSchema.parse(search),
  beforeLoad: async () => {
    if (typeof window !== 'undefined') {
      const token = getClientCookie(H18_COOKIE_NAME)
      if (!token) {
        throw redirect({
          to: '/',
          search: { auth_h18: true },
        })
      }
    }
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    try {
      const tags = deps.tag ? [deps.tag] : undefined
      const res = await getH18List({
        data: {
          query: deps.q || '',
          category: deps.category,
          language: deps.language,
          tags,
          sort: deps.sort,
          page: deps.page,
        },
      })
      return { data: res }
    } catch {
      return { data: { books: [], total_pages: 1, current_page: 1, per_page: 0 } }
    }
  },
  component: H18ExplorePage,
})

const CATEGORIES = [
  { label: 'Semua Kategori', value: '' },
  { label: 'Doujinshi', value: 'doujinshi' },
  { label: 'Manga', value: 'manga' },
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
  { label: 'Populer Hari Ini', value: 'popular-today' },
  { label: 'Populer Minggu Ini', value: 'popular-week' },
  { label: 'Populer Bulan Ini', value: 'popular-month' },
  { label: 'Terbaru', value: 'recent' },
]

const POPULAR_TAGS = [
  { label: 'Sole Female', value: 'sole-female' },
  { label: 'Sole Male', value: 'sole-male' },
  { label: 'Romance', value: 'romance' },
  { label: 'Big Breasts', value: 'big-breasts' },
  { label: 'Schoolgirl', value: 'schoolgirl' },
  { label: 'Maid', value: 'maid' },
  { label: 'Nakadashi', value: 'nakadashi' },
  { label: 'Group', value: 'group' },
  { label: 'Vanilla', value: 'vanilla' },
  { label: 'Full Color', value: 'full-color' },
]

function H18ExplorePage() {
  const { data } = Route.useLoaderData()
  const search = Route.useSearch()
  const { isAuthenticated } = useH18Auth()
  const navigate = useNavigate()

  const [inputQuery, setInputQuery] = useState(search.q || '')

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
    updateSearch({ q: inputQuery.trim() })
  }

  const handleClearFilters = () => {
    setInputQuery('')
    navigate({
      to: '/h-explore',
      search: {
        q: '',
        category: undefined,
        language: undefined,
        tag: undefined,
        sort: 'popular',
        page: 1,
      },
    })
  }

  return (
    <main className="relative flex flex-col items-center justify-start min-h-screen bg-[#08050a] text-slate-100 overflow-x-hidden pt-22 pb-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-6">
        {/* Header & Back Link */}
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
                Cari komik dengan filter kategori, bahasa, dan tag lengkap.
              </p>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Cari judul atau tag..."
              className="w-full h-11 bg-black/70 border border-white/15 focus:border-[#ff2d78] rounded-xl pl-10 pr-9 text-xs sm:text-sm text-white outline-none transition-colors placeholder:text-slate-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {inputQuery && (
              <button
                type="button"
                onClick={() => {
                  setInputQuery('')
                  updateSearch({ q: '' })
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-[#110a17] border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Filter className="w-4 h-4 text-[#ff2d78]" />
              <span>Filter & Urutan</span>
            </div>

            {(search.category || search.language || search.tag || search.q || search.sort !== 'popular') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-[#ff2d78] hover:underline font-semibold cursor-pointer"
              >
                Reset Semua Filter
              </button>
            )}
          </div>

          {/* Row 1: Select Dropdowns (Category, Language, Sort) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Category */}
            <select
              value={search.category || ''}
              onChange={(e) => updateSearch({ category: e.target.value || undefined })}
              className="w-full h-10 px-3 bg-black/60 border border-white/15 focus:border-[#ff2d78] rounded-xl text-xs sm:text-sm text-white outline-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-[#110a17] text-white">
                  {cat.label}
                </option>
              ))}
            </select>

            {/* Language */}
            <select
              value={search.language || ''}
              onChange={(e) => updateSearch({ language: e.target.value || undefined })}
              className="w-full h-10 px-3 bg-black/60 border border-white/15 focus:border-[#ff2d78] rounded-xl text-xs sm:text-sm text-white outline-none cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value} className="bg-[#110a17] text-white">
                  {lang.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={search.sort || 'popular'}
              onChange={(e) => updateSearch({ sort: e.target.value as any })}
              className="w-full h-10 px-3 bg-black/60 border border-white/15 focus:border-[#ff2d78] rounded-xl text-xs sm:text-sm text-white outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#110a17] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Row 2: Popular Tag Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
            {POPULAR_TAGS.map((t) => {
              const isSelected = search.tag === t.value
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => updateSearch({ tag: isSelected ? undefined : t.value })}
                  className={`shrink-0 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/30'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                  }`}
                >
                  #{t.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Results Grid */}
        {books.length > 0 ? (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {books.map((comic, index) => (
                <H18Card key={comic.id} data={comic} index={index} />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() =>
                  navigate({
                    to: '/h-explore',
                    search: { ...search, page: Math.max(1, currentPage - 1) },
                  })
                }
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 text-xs font-bold text-white transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <span className="text-xs font-semibold text-slate-400">
                Halaman <strong className="text-white">{currentPage}</strong> dari{' '}
                <strong className="text-white">{totalPages}</strong>
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  navigate({
                    to: '/h-explore',
                    search: { ...search, page: currentPage + 1 },
                  })
                }
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 text-xs font-bold text-white transition-all cursor-pointer"
              >
                <span>Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#ff2d78]/15 border border-[#ff2d78] text-[#ff2d78] flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-white">Tidak Ada Hasil Ditemukan</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
              Coba kurangi filter atau gunakan kata kunci pencarian yang lebih umum.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-xl bg-[#ff2d78] text-white text-xs font-bold cursor-pointer hover:bg-[#e02068] transition-colors"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
