import LatestCard from '@/features/view-comic/latestCard'
import { Button } from '@/shared/shadcn/button'
import { Label } from '@/shared/shadcn/label'
import type { ComicType } from '@/shared/types/comicResponse.type'
import { LucideTimer } from 'lucide-react'
import React from 'react'

interface Props {
    latest: ComicType[]
}

export default function LatestSection({ latest }: Props) {
    return (
        <section className='flex flex-col w-full gap-2 p-2 rounded-md'>
            <header className='flex items-center justify-between w-full'>
                <Label className='text-white font-semibold text-2xl'>
                    <LucideTimer className='w-6 h-6 text-primary' />
                    Update Terbaru
                </Label>
            </header>
            <div className='grid grid-cols-3 md:flex md:flex-col w-full h-full gap-2'>
                {latest?.map((data) => {
                    return (
                        <LatestCard data={data} />
                    )
                }).slice(0, 5)}
            </div>
            <Button className='flex items-center justify-center w-full bg-gray-600 transition duration-700'>
                {" Selengkapnya >"}
            </Button>
        </section>
    )
}
