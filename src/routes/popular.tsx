import { getPopularManga } from '@/api/server/manga'
import PopularCard from '@/features/manga/components/cards/PopularCard'
import { Button } from '@/shared/shadcn/button'
import { Label } from '@/shared/shadcn/label'
import { getPagination } from '@/shared/utils/pagination'
import { createFileRoute } from '@tanstack/react-router'
import { Flame } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/popular')({
    component: RouteComponent,
    loader: async () => {
        return {
            popular: await getPopularManga({ data: { type: "all_time", page: 1, pageSize: 20 } })
        }
    }
})

function RouteComponent() {
    const { popular } = Route.useLoaderData()
    const [currentPage, setCurrentPage] = useState(1)
    const totalPage = popular?.meta.total_page
    const paginations = getPagination(currentPage, totalPage || 1)

    return (
        <div className='font-primary flex flex-col w-full min-h-screen px-6 py-24 gap-5'>
            <header className='flex flex-col md:flex-row items-center justify-between w-full gap-2'>
                <Label className='text-white font-semibold text-2xl'>
                    <Flame className='w-6 h-6 text-primary' />
                    Komik Populer
                </Label>
            </header>
            <section className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 w-full gap-1 md:gap-3'>
                {popular?.data?.map((data, i) => (
                    <PopularCard key={i} index={i} data={data} />
                ))}
            </section>
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
                                key={""}
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
        </div>
    )
}
