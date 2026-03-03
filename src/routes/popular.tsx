import { defaultImage } from '@/shared/dummy/image'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { Label } from '@/shared/shadcn/label'
import { countryCodeToFlag } from '@/shared/utils/countryConverter'
import { formatRelativeTime } from '@/shared/utils/dateConverter'
import { createFileRoute } from '@tanstack/react-router'
import { Flame, Timer } from 'lucide-react'

export const Route = createFileRoute('/popular')({
    component: RouteComponent,
})

function RouteComponent() {

    return (
        <div className='font-primary flex flex-col w-full min-h-screen px-6 py-24 gap-5'>
            <header className='flex flex-col md:flex-row items-center justify-between w-full gap-2'>
                <Label className='text-white font-semibold text-2xl'>
                    <Flame className='w-6 h-6 text-primary' />
                    Komik Populer
                </Label>
            </header>
            <section className='grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 w-full gap-1 md:gap-3'>
                {Array.from({ length: 15 }).map((_, i) => (
                    <div className='flex flex-col items-center justify-start w-full h-auto bg-[#232323] overflow-hidden rounded-md gap-2'>
                        <div className='relative w-full h-56 md:h-65'>
                            <img src={""} alt='no-image' className='text-white flex items-center justify-center w-full h-full overflow-hidden rounded-md bg-gray-800 object-cover' />
                            <Label className='absolute top-0 flex items-center justify-center text-lg px-1 rounded-full'>
                                {countryCodeToFlag("KR")}
                            </Label>
                        </div>
                        <div className='flex flex-col w-full items-center justify-center font-semibold gap-1 px-2'>
                            <Label className='w-full text-white rounded-sm font-semibold text-[12px] md:text-[13px] lg:text-[15px] line-clamp-1'>
                                Judulnya adalahhhh FIky
                            </Label>
                        </div>
                        <div className='flex w-full items-center justify-between text-gray-400 p-2'>
                            <Label className='flex items-center justify-start gap-1 text-[12px] sm:text-[13px]'>
                                <Timer className='w-3 h-3 sm:w-4 sm:h-4 text-primary' />
                                {new Date().getFullYear()}
                            </Label>
                            <Label className='flex items-center justify-between text-[12px] sm:text-[13px]'>
                                {formatRelativeTime(new Date())}
                            </Label>
                        </div>
                    </div>
                ))}
            </section>
            <section className='flex items-center justify-center w-full'>
                <Button className='flex items-center justify-center gap-2 bg-primary text-white font-semibold hover:bg-primary/90 transition duration-700'>
                    Sebelumnya
                </Button>
                <div className='flex items-center justify-center gap-2 bg-gray-600/20 backdrop-blur-sm w-auto h-auto p-2 rounded-full px-5 font-semibold text-white'>
                </div>
                <Button className='flex items-center justify-center gap-2 bg-primary text-white font-semibold hover:bg-primary/90 transition duration-700'>
                    Selanjutnya
                </Button>
            </section>
        </div>
    )
}
