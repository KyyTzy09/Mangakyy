import { Button } from '@/shared/shadcn/button'
import { Label } from '@/shared/shadcn/label'
import type { ComicType } from '@/shared/types/comicResponse.type'
import { Flame } from 'lucide-react'
import React from 'react'

interface Props {
    popular: ComicType[]
}

const recommendationButton = [
    {
        title: "Minggu ini",
        value: ""
    },
    {
        title: "Manhua",
        value: "manhua"
    },
    {
        title: "Manhwa",
        value: "manhwa"
    },
]

export default function PopularSection({ popular }: Props) {
    return (
        <section className='flex flex-col w-full h-full text-white'>
            <header className='flex items-center justify-between w-full'>
                <Label className='text-white font-semibold text-2xl'>
                    <Flame className='w-6 h-6 text-red-500' />
                    Populer { }
                </Label>
                <div className='flex items-center justify-between bg-gray-600/20 backdrop-blur-sm w-auto h-auto p-2 rounded-full gap-2'>
                    {Array.from({ length: 3 }).map(() => {
                        return (
                            <Button
                                className='bg-transparent hover:bg-primary rounded-full transition duration-700 font-semibold'>
                                Button
                            </Button>
                        )
                    })}
                </div>
            </header>
            <div className='grid grid-cols-5 w-full gap-3'>

            </div>
        </section>
    )
}
