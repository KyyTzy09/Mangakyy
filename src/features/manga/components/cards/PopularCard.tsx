import { defaultImage } from '@/shared/dummy/image'
import type { PopularComic } from '@/shared/interfaces'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { Label } from '@/shared/shadcn/label'
import { countryCodeToFlag } from '@/shared/utils/countryConverter'
import { formatRelativeTime } from '@/shared/utils/dateConverter'
import { useNavigate } from '@tanstack/react-router'
import { Star, Timer } from 'lucide-react'
import { motion } from 'motion/react'

interface Props {
    data: PopularComic
    index: number
}

export default function PopularCard({ data: { title, manga_id: mangaId, cover_image_url, status, country_id, release_year, user_rate, description, latest_chapter_id: chapterId, latest_chapter_number, latest_chapter_time }, index }: Props) {
    const navigate = useNavigate()
    return (
        <motion.div
            initial={{ translateY: 10 }}
            animate={{ translateY: 0 }}
            exit={{ translateY: 10 }}
            onClick={() => navigate({ to: "/read/$mangaId", params: { mangaId } })}
            transition={{ delay: index * 0.1 }}
            className='group relative flex flex-col items-center justify-start w-full h-auto bg-[#232323] overflow-hidden rounded-md gap-2'>
            <div className='relative w-full h-50 sm:h-56 md:h-65'>
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
                    {formatRelativeTime(new Date(latest_chapter_time), true)}
                </Label>
            </div>
            <div className='absolute opacity-0 group-hover:opacity-100 flex flex-col items-center justify-end w-full h-full bg-linear-to-b from-transparent via-black/80 to-black translate-y-24 group-hover:translate-y-0 transition duration-700'>
                <section className='flex flex-col items-center justify-between w-full h-1/2 p-2'>
                    <div className='flex items-center justify-center w-full'>
                        <Badge className='flex items-center justify-center text-[11px] text-white'>
                            <Star className='fill-yellow-400' />{user_rate}
                        </Badge>
                    </div>
                    <div className='flex flex-col w-full'>
                        <Label className='text-sm md:text-lg text-white font-semibold line-clamp-2 text-center'>{title}</Label>
                        <Label className='text-[11px] text-gray-400 text-center line-clamp-2'>{description}</Label>
                    </div>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate({ to: "/chapter/$chapterId", params: { chapterId } })
                        }}
                        className='flex items-center justify-center w-full text-[11px]'>
                        <p className='text-white'>
                            Chapter {latest_chapter_number}
                        </p>
                        {"-"}
                        <p>
                            {formatRelativeTime(new Date(latest_chapter_time), true)}
                        </p>
                    </Button>
                </section>
            </div>
        </motion.div >
    )
}
