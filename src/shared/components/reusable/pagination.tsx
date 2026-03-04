import { Button } from '@/shared/shadcn/button'
import { getPagination } from '@/shared/utils/pagination'
import React from 'react'

interface Props {
    currentPage: number
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
    totalPage: number
}

export default function PaginationSection({ currentPage, setCurrentPage, totalPage }: Props) {
    const paginations = getPagination(currentPage, totalPage || 1)
    return (
        <section className='flex items-center justify-center w-full gap-4'>
            <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
            >
                {"<"}
            </Button>
            <div className="flex gap-2">
                {paginations.map((page) =>
                    page === "..." ? (
                        <Button
                            className={`text-white w-10 flex items-center justify-center border border-gray-500 rounded-md bg-transparent hover:text-white transition`}
                        >
                            ...
                        </Button>
                    ) : (
                        <Button
                            key={page}
                            onClick={() => setCurrentPage(Number(page))}
                            className={`${page === currentPage
                                ? "px-3 py-1 bg-primary"
                                : "px-3 py-1 bg-transparent"
                                } text-white w-10 flex items-center justify-center border border-gray-500 rounded-md hover:bg-primary hover:text-white transition`}
                        >
                            {page}
                        </Button>
                    )
                )}
            </div>
            <Button
                disabled={currentPage === totalPage}
                onClick={() => setCurrentPage(p => p + 1)}
            >
                {">"}
            </Button>
        </section>
    )
}
