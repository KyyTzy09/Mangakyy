import { getPopularManga } from '@/api/server/manga'
import PopularCard from '@/features/manga/components/cards/PopularCard'
import { useGetPopularManga } from '@/features/manga/hooks/MangaQuery'
import PaginationSection from '@/shared/components/reusable/pagination'
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

    const { data } = useGetPopularManga("all_time", popular?.data, currentPage, 20)
    return (
        <div className='font-primary flex flex-col w-full min-h-screen px-6 py-24 gap-5'>
            <header className='flex flex-col md:flex-row items-center justify-between w-full gap-2'>
                <Label className='text-white font-semibold text-2xl'>
                    <Flame className='w-6 h-6 text-primary' />
                    Komik Populer
                </Label>
            </header>
            <section className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 w-full gap-1 md:gap-3'>
                {data?.map((data, i) => (
                    <PopularCard key={i} index={i} data={data} />
                ))}
            </section>
            <PaginationSection
                totalPage={popular?.meta?.total_page || 1}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    )
}
