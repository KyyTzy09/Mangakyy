import { getPopularManga } from '@/api/server/manga'
import { defaultImage } from '@/shared/dummy/image'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { Label } from '@/shared/shadcn/label'
import { countryCodeToFlag } from '@/shared/utils/countryConverter'
import { formatRelativeTime } from '@/shared/utils/dateConverter'
import { getPagination } from '@/shared/utils/pagination'
import { createFileRoute } from '@tanstack/react-router'
import { Flame, Timer } from 'lucide-react'
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
            <section className='grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 w-full gap-1 md:gap-3'>
                {popular?.data?.map(({ manga_id, title, country_id, cover_image_url, updated_at, status, release_year, latest_chapter_number, latest_chapter_id, latest_chapter_time }, i) => (
                    <div
                        key={manga_id}
                        className='group relative flex flex-col items-center justify-start w-full h-auto bg-[#232323] overflow-hidden rounded-md gap-2'>
                        <div className='relative w-full h-56 md:h-65'>
                            <img src={cover_image_url || defaultImage} alt='no-image' className='text-white flex items-center justify-center w-full h-full overflow-hidden rounded-md bg-gray-800 object-cover' />
                            <Label className='bg-linear-to-br from-transparent to-blue-600 text-sm backdrop-blur-sm px-2 py-1 absolute top-0 left-0 flex items-center justify-center gap-1 text-white rounded-br-sm'>
                                {status === 1 ? "Ongoing" : "Completed"}
                            </Label>
                            <Label className='absolute top-0 right-0 flex items-center justify-center text-lg rounded-br-sm px-2'>
                                {countryCodeToFlag(country_id)}
                            </Label>
                        </div>
                        <div className='flex flex-col w-full items-center justify-center font-semibold gap-1 px-2'>
                            <Label className='w-full text-white rounded-sm font-semibold text-[12px] md:text-[13px] lg:text-[15px] line-clamp-1'>
                                {title}
                            </Label>
                        </div>
                        <div className='flex w-full items-center justify-between text-gray-400 p-2'>
                            <Label className='flex items-center justify-start gap-1 text-[12px] sm:text-[13px]'>
                                <Timer className='w-3 h-3 sm:w-4 sm:h-4 text-primary' />
                                {release_year}
                            </Label>
                            <Label className='flex items-center justify-between text-[12px] sm:text-[13px]'>
                                {formatRelativeTime(updated_at)}
                            </Label>
                        </div>
                        <div className='absolute hidden group-hover:flex flex-col items-center justify-end w-full h-full bg-linear-to-b from-transparent via-black/80 to-black'>
                            <section className='flex flex-col items-center justify-between w-full h-1/2 p-2'>
                                <Label className='text-sm md:text-lg text-white font-semibold line-clamp-2 text-center'>{title}</Label>
                                <Button className='flex items-center justify-between w-full text-[12px]'>
                                    <p className='text-white'>
                                        Chapter {latest_chapter_number}
                                    </p>
                                    <p>
                                        {formatRelativeTime(new Date(latest_chapter_time), true)}
                                    </p>
                                </Button>
                            </section>
                        </div>
                    </div>
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
