import type { ComicType } from '@/shared/interfaces'
import { Badge } from '@/shared/shadcn/badge'
import { Label } from '@/shared/shadcn/label'
import { countryCodeToFlag } from '@/shared/utils/countryConverter'
import { formatCompactNumber } from '@/shared/utils/formater'
import { Link } from '@tanstack/react-router'
import { Eye } from 'lucide-react'
import { motion } from 'motion/react'

interface Props {
    data: ComicType
    index: number
}

export default function GenreMangaCard({ data, index }: Props) {
    return (
        <Link to='/detail/$mangaId' params={{ mangaId: data.manga_id }}>
            <motion.article
                initial={{ translateY: 10 }}
                animate={{ translateY: 0 }}
                exit={{ translateY: 10 }}
                transition={{ delay: index * 0.1 }}
                className="group relative flex flex-col w-full h-full bg-linear-to-br from-[#0f172a] via-[#0b1220] to-[#090f1a] rounded-md overflow-hidden text-sm cursor-pointer">
                <div className="absolute top-0 right-1 text-xl z-10">
                    {countryCodeToFlag(data.country_id)}
                </div>

                {/* IMAGE */}
                <div className="w-full h-52 sm:h-64 md:h-60 overflow-hidden">
                    <img
                        src={data.cover_image_url}
                        alt="no-image"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* OVERLAY */}
                    <div className="absolute inset-0 felx flex-col items-center justify-start text-center gap-2 bg-black/80 opacity-0 group-hover:opacity-100 transition duration-300 flex p-3 z-20">
                        {data.is_recommended && <Badge className='text-xs bg-primary/40'>REKOMENDASI</Badge>}
                        <Label className='text-sm sm:text-lg line-clamp-2'>{data.title}</Label>
                        <p className="text-xs text-gray-200 line-clamp-4 translate-y-4 group-hover:translate-y-0 transition duration-300">
                            {data.description}
                        </p>
                        <div className='flex flex-wrap items-center justify-center w-full gap-2'>
                            {data?.taxonomy?.Genre.slice(0, 3).map((genre, i) => (
                                <Badge
                                    key={i}
                                    className='flex items-center justify-center h-10 rounded-md border cursor-pointer transition
                            border-gray-400 bg-primary/50 text-[10px]'
                                >
                                    {genre.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                {/* INFO */}
                <div className="flex flex-col items-center justify-between w-full gap-2 p-2">
                    <Label className="text-center line-clamp-2">
                        {data.title}
                    </Label>

                    <div className="flex items-center justify-center w-full gap-1 text-[10px] md:text-sm">

                        <Badge className="rounded-sm text-[8px] sm:text-[12px] bg-primary/40 flex items-center gap-1">
                            <Eye className="w-4 h-4" strokeWidth={2} />
                            {formatCompactNumber(data.view_count)}
                        </Badge>

                        <Badge className="rounded-sm text-[8px] sm:text-[12px] bg-primary/40">
                            CH.{data.latest_chapter_number}
                        </Badge>

                    </div>
                </div>
            </motion.article>
        </Link>
    )
}
