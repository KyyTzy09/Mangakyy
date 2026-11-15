import { useState, useEffect } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Timer, ArrowLeft, Trash2, Search, X, Sparkles, BookOpen } from 'lucide-react'
import { useH18Auth } from '@/features/h18/hooks/useH18Auth'
import H18LockedGate from '@/features/h18/components/H18LockedGate'
import { getH18ImageUrl } from '@/features/h18/utils/imageUrl'
import {
  getH18Histories,
  removeH18History,
  clearH18Histories,
} from '@/features/h18/utils/history'
import type { H18HistoryItem } from '@/features/h18/utils/history'

export const Route = createFileRoute('/h-history')({
  component: H18HistoryPage,
})

function H18HistoryPage() {
  const { isAuthenticated } = useH18Auth()
  const navigate = useNavigate()
  const [historyList, setHistoryList] = useState<H18HistoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      setHistoryList(getH18Histories())
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <H18LockedGate onSuccess={() => window.location.reload()} />
  }

  const handleRemoveOne = (e: React.MouseEvent, id: number | string) => {
    e.preventDefault()
    e.stopPropagation()
    removeH18History(id)
    setHistoryList(getH18Histories())
  }

  const handleClearAll = () => {
    if (window.confirm('Hapus semua riwayat baca H18?')) {
      clearH18Histories()
      setHistoryList([])
    }
  }

  const filtered = historyList.filter((item) => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    return (
      item.title.toLowerCase().includes(q) ||
      (item.japanese_title && item.japanese_title.toLowerCase().includes(q))
    )
  })

  return (
    <main className="relative flex flex-col items-center justify-start min-h-screen bg-[#08050a] text-slate-100 overflow-x-hidden pt-22 pb-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Link
              to="/h18"
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#ff2d78] text-white flex items-center justify-center border border-white/10 transition-colors"
              title="Kembali ke Katalog H18"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight flex items-center gap-2">
                <Timer className="w-6 h-6 text-[#ff2d78]" />
                <span>Riwayat Baca H18</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#ff2d78] text-white font-black">
                  18+
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Komik dewasa yang baru saja Anda buka atau baca di MangaKyy.
              </p>
            </div>
          </div>

          {/* Clear All History Button */}
          {historyList.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Semua Riwayat</span>
            </button>
          )}
        </div>

        {/* Search Bar when history exists */}
        {historyList.length > 0 && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#110a17] border border-white/10">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari riwayat komik berdasarkan judul..."
                className="w-full h-10 bg-black/60 border border-white/15 focus:border-[#ff2d78] rounded-xl pl-10 pr-9 text-xs sm:text-sm text-white outline-none transition-colors placeholder:text-slate-500 font-medium"
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
            <div className="text-xs text-slate-400 px-2 shrink-0">
              Total: <strong className="text-white">{filtered.length}</strong> komik
            </div>
          </div>
        )}

        {/* History Cards Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  navigate({
                    to: '/h-detail/$id',
                    params: { id: String(item.id) },
                  })
                }
                className="group relative flex flex-col bg-[#140c19] border border-white/10 hover:border-[#ff2d78] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#ff2d78]/20 cursor-pointer"
              >
                {/* Thumbnail Aspect Ratio Container */}
                <div className="relative aspect-[3/4] w-full bg-[#1b1022] overflow-hidden">
                  <img
                    src={getH18ImageUrl(item.thumbnail_url || item.cover_url)}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget
                      if (item.cover_url && !target.src.includes(item.cover_url)) {
                        target.src = item.cover_url
                      }
                    }}
                  />

                  {/* Top Badges: 18+ and Delete Button */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="px-2 py-0.5 rounded-md bg-[#ff2d78] text-white text-[10px] font-black shadow-md">
                      18+
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleRemoveOne(e, item.id)}
                    title="Hapus dari riwayat"
                    className="absolute top-2 right-2 z-10 w-7 h-7 rounded-lg bg-black/70 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border border-white/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Bottom Gradient Overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#140c19] via-[#140c19]/60 to-transparent pointer-events-none" />

                  {/* Page count pill */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-semibold text-slate-300 border border-white/10">
                    <BookOpen className="w-3 h-3 text-[#ff2d78]" />
                    <span>{item.page_count} P</span>
                  </div>

                  {/* Reading Progress Percentage Badge */}
                  {item.progress !== undefined && item.progress > 0 && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/85 backdrop-blur-sm text-[10px] font-black text-[#ff2d78] border border-[#ff2d78]/40 shadow-xs">
                      <span>{item.progress}%</span>
                    </div>
                  )}

                  {/* Reading Progress Bar along bottom edge of thumbnail */}
                  {item.progress !== undefined && item.progress > 0 && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-black/60 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#ff2d78] to-pink-400"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-col p-3 gap-1">
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#ff2d78] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span className="text-[10px] text-slate-400 font-medium">
                      {item.progress !== undefined && item.progress > 0
                        ? `Hal. ${item.last_page || 1} • ${item.progress}%`
                        : `ID: #${item.id}`}
                    </span>
                    <span className="text-[10px] text-[#ff2d78] font-medium">
                      {new Date(item.read_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : historyList.length > 0 ? (
          /* Search yielded no results */
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/5 text-slate-400 flex items-center justify-center">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-white">Tidak Ada Hasil</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Tidak ditemukan komik riwayat dengan kata kunci &quot;{searchQuery}&quot;.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-colors cursor-pointer"
            >
              Hapus Pencarian
            </button>
          </div>
        ) : (
          /* Empty history */
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-[#ff2d78]/15 border border-[#ff2d78] text-[#ff2d78] flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl text-white">Belum Ada Riwayat Baca</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
              Komik dewasa yang Anda buka atau baca di mode H18 akan otomatis tercatat di sini.
            </p>
            <Link
              to="/h18"
              className="px-5 py-2.5 rounded-xl bg-[#ff2d78] hover:bg-[#e02068] text-white text-xs font-bold transition-colors cursor-pointer shadow-md shadow-[#ff2d78]/30 mt-2"
            >
              Buka Katalog H18
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
