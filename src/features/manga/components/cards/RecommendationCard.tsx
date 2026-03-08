import { Label } from '@/shared/shadcn/label'
import type { ComicType } from '@/shared/interfaces'
import { countryCodeToFlag } from '@/shared/utils/countryConverter'
import { formatRelativeTime } from '@/shared/utils/dateConverter'
import { Link } from '@tanstack/react-router'
import { Star, Timer } from 'lucide-react'
import { motion } from 'motion/react'

interface Props {
    data: ComicType
    index: number
}

export default function RecommendationCard({ data, index }: Props) {
    return (
        <Link to={`/read/$mangaId`} params={{ mangaId: data.manga_id }} >
            <motion.article
                initial={{ translateY: 10 }}
                animate={{ translateY: 0 }}
                exit={{ translateY: 10 }}
                transition={{ delay: index * 0.1 }}
                key={data.manga_id}
                className='group flex flex-col w-full h-auto font-primary text-white bg-black gap-3 p-2 rounded-sm'>
                <div className='relative w-full h-48 sm:52 md:h-60 lg:h-65 overflow-hidden rounded-md'>
                    <img src={data.cover_image_url} alt="No-image" className='w-full h-full bg-primary object-cover group-hover:scale-105 group-hover:-translate-y-3 transition duration-700' />
                    <div className='absolute flex flex-col items-center justify-between top-0 right-0 w-full h-full bg-linear-to-b from-transparent to-black p-1'>
                        <div className='flex w-full items-center justify-between'>
                            <Label className='flex items-center justify-center text-lg px-1 rounded-full'>
                                {countryCodeToFlag(data.country_id)}
                            </Label>
                            <Label className='bg-black/30 backdrop-blur-sm text-[12px] p-1 rounded-bl-md'>
                                <Star className='w-3 h-3 text-yellow-300 fill-yellow-300' />
                                {data.user_rate}
                            </Label>
                        </div>
                        <div className='flex flex-col w-full font-semibold'>
                            <p className='text-[13px] md:text-[15px] group-hover:text-primary line-clamp-1 transition duration-700'>{data.title}</p>
                            <p className='text-gray-400 text-[12px]'>
                                Chapter {data.latest_chapter_number}
                            </p>
                        </div>
                    </div>
                </div>
                <div className='flex w-full items-center justify-between text-gray-400'>
                    <Label className='flex items-center justify-start gap-1 text-[10px] sm:text-[13px]'>
                        <Timer className='w-3 h-3 sm:w-4 sm:h-4 text-primary' />
                        {data.release_year}
                    </Label>
                    <Label className='flex items-center justify-between text-[10px] sm:text-[13px]'>
                        {formatRelativeTime(new Date(data.latest_chapter_time))}
                    </Label>
                </div>
            </motion.article>
        </Link >
    )
}
