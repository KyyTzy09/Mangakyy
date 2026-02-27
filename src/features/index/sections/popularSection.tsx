import RecommendationCard from '@/features/view-comic/recommendationCard'
import { Button } from '@/shared/shadcn/button'
import { Label } from '@/shared/shadcn/label'
import type { ComicType } from '@/shared/types/comicResponse.type'
import { Flame } from 'lucide-react'
import React, { useState } from 'react'

interface Props {
    popular: ComicType[]
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
    const [selectedType, setSelectedType] = useState<string>()

    return (
        <section className='flex flex-col w-full h-full text-white'>
            <header className='flex items-center justify-between w-full'>
                <Label className='text-white font-semibold text-2xl'>
                    <Flame className='w-6 h-6 text-red-500' />
                    Populer { }
                </Label>
                <div className='flex items-center justify-between bg-gray-600/20 backdrop-blur-sm w-auto h-auto p-2 rounded-full gap-2'>
                    {popularButton.map(({ title, value }) => {
                        return (
                            <Button
                                className='bg-transparent hover:bg-primary rounded-full transition duration-700 font-semibold'>
                                {title}
                            </Button>
                        )
                    })}
                </div>
            </header>
            <div className='grid grid-cols-5 w-full gap-3'>
                {popular?.map((data) => {
                    return (
                        <RecommendationCard data={data} />
                    )
                })}
            </div>
        </section>
    )
}
