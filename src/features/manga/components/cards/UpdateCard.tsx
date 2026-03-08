import type { UpdateComic } from '@/shared/interfaces'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { formatRelativeTime } from '@/shared/utils/dateConverter'
import { useNavigate } from '@tanstack/react-router'
import { BookOpen, Eye } from 'lucide-react'
import { motion } from 'motion/react'

interface Props {
    data: UpdateComic
    index: number
}

export default function MangaUpdateCard({ data, index }: Props) {
    const navigate = useNavigate()
    return (
        <motion.article
            initial={{ translateY: 10 }}
            animate={{ translateY: 0 }}
            exit={{ translateY: 10 }}
            onClick={() => navigate({ to: "/detail/$mangaId", params: { mangaId: data.manga_id } })}
            transition={{ delay: index * 0.1 }}
            className='group w-full h-full border border-gray-400/60 rounded-sm overflow-hidden cursor-pointer'>
            <div className="relative w-full h-60 sm:h-64 md:h-60 overflow-hidden">
                <img
                    src={data.cover_image_url}
                    alt="no-image"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className='absolute top-0 left-0 text-xs flex flex-col items-start justify-end w-full h-full bg-linear-to-b from-transparent via-black/60 to-black p-2 gap-2 z-10'>
                    <p className='line-clamp-2 font-semibold'>{data.title}</p>
                    <p className='text-[10px] line-clamp-1'>Ch {data.latest_chapter_number} - {formatRelativeTime(data.updated_at)}</p>
                    <div className='flex flex-row items-center justify-center gap-1'>
                        {data.taxonomy.Genre.slice(0, 2).map(({ name }) => (
                            <Badge className='bg-primary/20 border border-primary text-[10px] line-clamp-1'>{name}</Badge>
                        ))}
                    </div>
                </div>
                <div className='absolute opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-0 top-0 left-0 text-xs flex flex-col items-center justify-center w-full h-full bg-black/70 z-20 p-5 gap-2 transition duration-500'>
                    <Button onClick={(e) => {
                        e.stopPropagation()
                        navigate({ to: "/chapter/$chapterId", params: { chapterId: data.latest_chapter_id } })
                    }} className='w-full text-start hover:bg-white/10 text-sm py-2 px-3 rounded-md'>
                        <BookOpen />
                        Baca
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate({ to: "/detail/$mangaId", params: { mangaId: data.manga_id } })
                        }}
                        className='w-full text-start bg-primary/20 border border-primary/70 hover:bg-gray-800 text-sm py-2 px-3 rounded-md'>
                        <Eye />
                        Detail
                    </Button>
                </div>
            </div>
        </motion.article>
    )
}
