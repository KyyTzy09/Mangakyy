import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { ArrowLeft, Tag, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { z } from 'zod'
import { getH18List } from '@/api/server/h18'
import { useH18Auth } from '@/features/h18/hooks/useH18Auth'
import H18LockedGate from '@/features/h18/components/H18LockedGate'
import H18Card from '@/features/h18/components/H18Card'

const genreSearchSchema = z.object({
  sort: z
    .enum(['popular', 'popular-today', 'popular-week', 'popular-month', 'recent'])
    .optional()
    .default('popular'),
  page: z.number().optional().default(1),
})

export const Route = createFileRoute('/h-genre-detail/$genre')({
  validateSearch: (search) => genreSearchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ params: { genre }, deps }) => {
    try {
      const cleanTag = genre.replace(/-/g, ' ')
      const res = await getH18List({
        data: {
          query: '',
          tags: [cleanTag],
          sort: deps.sort,
          page: deps.page,
        },
      })
      return { data: res, genre: cleanTag, rawGenre: genre }
    } catch {
      return {
        data: { books: [], total_pages: 1, current_page: 1, per_page: 0 },
        genre,
        rawGenre: genre,
      }
    }
  },
  component: H18GenreDetailPage,
})

const SORT_OPTIONS = [
  { label: 'Terpopuler', value: 'popular' },
  { label: 'Populer Minggu Ini', value: 'popular-week' },
  { label: 'Populer Bulan Ini', value: 'popular-month' },
  { label: 'Terbaru', value: 'recent' },
]

function H18GenreDetailPage() {
  const { data, genre, rawGenre } = Route.useLoaderData()
  const search = Route.useSearch()
  const { isAuthenticated } = useH18Auth()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    return <H18LockedGate onSuccess={() => window.location.reload()} />
  }

  const books = data?.books || []
  const totalPages = data?.total_pages || 1
  const currentPage = search.page || 1

  const handleSortChange = (newSort: any) => {
    navigate({
      to: '/h-genre-detail/$genre',
      params: { genre: rawGenre },
      search: {
        ...search,
        sort: newSort,
        page: 1,
      },
    })
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    navigate({
      to: '/h-genre-detail/$genre',
      params: { genre: rawGenre },
      search: {
        ...search,
        page: newPage,
      },
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="relative flex flex-col items-center justify-start min-h-screen bg-[#08050a] text-slate-100 overflow-x-hidden pt-22 pb-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-6">
        {/* 1. Header with Breadcrumb and Genre Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Link
              to="/h-genre"
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#ff2d78] text-white flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
              title="Kembali ke Daftar Genre"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#ff2d78] font-bold uppercase tracking-wider">
                  Genre Komik
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#ff2d78]" />
                <span className="capitalize">#{genre}</span>
              </h1>
            </div>
          </div>

          {/* Sort Pills in MangaKyy Style */}
          <div className="flex items-center gap-1.5 bg-[#140c19] border border-white/10 p-1 rounded-xl">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSortChange(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  search.sort === opt.value
                    ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Comic Cards Grid */}
        {books.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {books.map((comic, index) => (
                <H18Card key={comic.id} data={comic} index={index} />
              ))}
            </div>

            {/* Pagination Controls in MangaKyy Style */}
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
            <h3 className="font-bold text-lg text-white">Belum Ada Komik dengan Genre Ini</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
              Coba pilih genre lain atau gunakan fitur Explore untuk filter kombinasi.
            </p>
            <Link
              to="/h-genre"
              className="px-4 py-2 rounded-xl bg-[#ff2d78] text-white text-xs font-bold cursor-pointer hover:bg-[#e02068] transition-colors"
            >
              Lihat Semua Genre
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
