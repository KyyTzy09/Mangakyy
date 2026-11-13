import { Button } from '@/shared/shadcn/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  page: number
  setPage: (page: number | ((prev: number) => number)) => void
  chapters: any
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void
}

export default function ChapterPagination({
  page,
  setPage,
  chapters,
  setOpen,
}: Props) {
  const totalPage = chapters?.meta?.total_page || 1

  const handlePageChange = (target: number | ((prev: number) => number)) => {
    const newPage = typeof target === 'function' ? target(page) : target
    setPage(newPage)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <section className="flex items-center justify-center w-full gap-4 pb-5">
      <Button
        disabled={page <= 1}
        onClick={() => handlePageChange((p) => p - 1)}
        className="bg-transparent border border-primary/90 text-white hover:bg-primary/20 cursor-pointer disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => setOpen(true)}
        className="bg-primary text-white font-semibold px-4 py-2 rounded-xl shadow-sm cursor-pointer"
        title="Buka daftar chapter"
      >
        Halaman {page}
      </Button>
      <Button
        disabled={page >= totalPage}
        onClick={() => handlePageChange((p) => p + 1)}
        className="bg-transparent border border-primary/90 text-white hover:bg-primary/20 cursor-pointer disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </section>
  )
}
