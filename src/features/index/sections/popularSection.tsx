import RecommendationCard from '@/features/manga/recommendationCard'
import { Button } from '@/shared/shadcn/button'
import { Label } from '@/shared/shadcn/label'
import type { ComicType, PopularComic } from '@/shared/interfaces'
import { Flame } from 'lucide-react'
import React, { useState } from 'react'

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
    const [selectedType, setSelectedType] = useState<{ title: string, value: string }>({ title: "Harian", value: "daily" })

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
                                onClick={() => setSelectedType({ title, value })}
                                className={`${selectedType.value === value ? "bg-primary" : "bg-transparent text-gray-400"}  hover:bg-blue-400 rounded-full transition duration-700 font-semibold`}>
                                {title}
                            </Button>
                        )
                    })}
                </div>
            </header>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full gap-3'>
                {popular?.map((data, i) => {
                    return (
                        <RecommendationCard data={data as ComicType} index={i} key={i} />
                    )
                })}
            </div>
        </section>
    )
}
