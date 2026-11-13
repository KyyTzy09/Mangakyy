import { Button } from '@/shared/shadcn/button'
import { getPagination } from '@/shared/utils/pagination'

interface Props {
  currentPage: number
  setCurrentPage: (page: number | ((prev: number) => number)) => void
  totalPage: number
}

export default function PaginationSection({
  currentPage,
  setCurrentPage,
  totalPage,
}: Props) {
  const paginations = getPagination(currentPage, totalPage || 1)

  const handlePageChange = (target: number | ((prev: number) => number)) => {
    const newPage = typeof target === 'function' ? target(currentPage) : target
    setCurrentPage(newPage)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <section className="flex items-center justify-center w-full gap-2 text-[10px] md:text-sm">
      <Button
        disabled={currentPage <= 1}
        onClick={() => handlePageChange((p) => p - 1)}
        className="cursor-pointer disabled:cursor-not-allowed"
      >
        {'<'}
      </Button>
      <div className="flex gap-2">
        {paginations.map((page, index) =>
          page === '...' ? (
            <Button
              key={`ellipsis-${index}`}
              disabled
              className="text-white w-8 text-[10px] md:text-sm md:w-10 flex items-center justify-center border border-gray-500 rounded-md bg-transparent opacity-60"
            >
              ...
            </Button>
          ) : (
            <Button
              key={page}
              onClick={() => handlePageChange(Number(page))}
              className={`${
                page === currentPage
                  ? 'px-3 py-1 bg-primary text-white font-semibold'
                  : 'px-3 py-1 bg-transparent text-white'
              } w-8 text-[10px] md:text-sm md:w-10 flex items-center justify-center border border-gray-500 rounded-md hover:bg-primary hover:text-white transition cursor-pointer`}
            >
              {page}
            </Button>
          ),
        )}
      </div>
      <Button
        disabled={currentPage >= totalPage || !totalPage}
        onClick={() => handlePageChange((p) => p + 1)}
        className="cursor-pointer disabled:cursor-not-allowed"
      >
        {'>'}
      </Button>
    </section>
  )
}
