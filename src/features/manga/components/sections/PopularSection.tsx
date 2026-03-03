import RecommendationCard from '@/features/manga/components/cards/RecommendationCard'
import { Button } from '@/shared/shadcn/button'
import { Label } from '@/shared/shadcn/label'
import type { ComicType, PopularComic } from '@/shared/interfaces'
import { Flame } from 'lucide-react'
import { useState } from 'react'
import { useGetPopularManga } from '../../hooks/MangaQuery'
import RecommendationCardSkeleton from '../RecommendationCardSkeleton'

interface Props {
    popular: PopularComic[]
}

const popularButton = [
    {
        title: "Harian",
        value: "daily"
    },
    {
        title: "Mingguan",
        value: "weekly"
    },
    {
        title: "Semua",
        value: "all_time"
    },
]

export default function PopularSection({ popular }: Props) {
    const [selectedType, setSelectedType] = useState<{ title: string, value: "daily" | "weekly" | "all_time" }>({ title: "Harian", value: "daily" })
    const { data, isPending } = useGetPopularManga(selectedType.value, popular)

    return (
        <section className='flex flex-col w-full h-full text-white gap-5'>
            <header className='flex flex-col md:flex-row items-center justify-between w-full gap-2'>
                <Label className='text-white font-semibold text-2xl'>
                    <Flame className='w-6 h-6 text-red-500' />
                    Populer {selectedType.title}
                </Label>
                <div className='flex items-center justify-between bg-gray-600/20 backdrop-blur-sm w-auto h-auto p-2 rounded-full gap-2'>
                    {popularButton.map(({ title, value }, i) => {
                        return (
                            <Button
                                key={i}
                                onClick={() => setSelectedType({ title, value: value as "daily" | "weekly" | "all_time" })}
                                className={`${value === selectedType.value ? "bg-primary text-white" : "bg-transparent text-gray-400"} rounded-full transition duration-700 font-semibold hover:text-white hover:bg-transparent`}>
                                {title}
                            </Button>
                        )
                    })}
                </div>
            </header>
            <div className='grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full gap-1 md:gap-3'>
                {!isPending ? data?.map((data, i) => {
                    return (
                        <RecommendationCard data={data as ComicType} index={i} key={i} />
                    )
                }) : <RecommendationCardSkeleton count={10} />}
            </div>
        </section >
    )
}
