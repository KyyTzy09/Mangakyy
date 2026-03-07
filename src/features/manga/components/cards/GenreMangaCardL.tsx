import type { ComicType } from '@/shared/interfaces'
import { countryCodeToFlag } from '@/shared/utils/countryConverter'
import { formatCompactNumber } from '@/shared/utils/formater'
import { Link } from '@tanstack/react-router'
import { Bookmark, Eye, Star } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

interface Props {
    data: ComicType
    index: number
}

export default function GenreMangaCardL({ data, index }: Props) {
    return (
        <Link to="/read/$mangaId" params={{ mangaId: data.manga_id }}>
            <motion.div
                initial={{ translateY: 10 }}
                animate={{ translateY: 0 }}
                exit={{ translateY: 10 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group flex gap-4 w-full h-50 p-3 rounded-xl bg-[#161616] hover:bg-[#1d1d1d] transition overflow-hidden"
            >
                {/* COVER */}
                <div className="relative w-24 sm:w-28 md:w-32 shrink-0 overflow-hidden rounded-md">
                    <img
                        src={data.cover_portrait_url || data.cover_image_url}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    {/* COUNTRY FLAG */}
                    <div className="absolute top-1 right-1 text-lg">
                        {countryCodeToFlag(data.country_id)}
                    </div>
                </div>

                {/* CONTENT */}
                <div className="flex flex-col justify-center w-full gap-2">

                    {/* TITLE */}
                    <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-1 group-hover:text-primary transition">
                        {data.title}
                    </h3>

                    {/* CHAPTER + STATUS */}
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                        <span>Chapter {data.latest_chapter_number}</span>

                        <span className="px-2 py-[2px] text-[10px] rounded-md bg-primary/30 text-primary">
                            {data.status === 1 ? "Ongoing" : "Completed"}
                        </span>
                    </div>

                    {/* STATS */}
                    <div className="flex items-center gap-4 text-xs text-gray-400">

                        <div className="flex items-center gap-1">
                            <Star size={14} className="text-orange-400" />
                            {data.user_rate}
                        </div>

                        <div className="flex items-center gap-1">
                            <Eye className='text-yellow-300' size={14} />
                            {formatCompactNumber(data.view_count)}
                        </div>

                        <div className="flex items-center gap-1">
                            <Bookmark className='text-pink-500' size={14} />
                            {formatCompactNumber(data.bookmark_count)}
                        </div>

                    </div>

                    {/* DESCRIPTION */}
                    <p className="text-xs text-gray-400 line-clamp-2 sm:line-clamp-3">
                        {data.description}
                    </p>

                </div>
            </motion.div>
        </Link>
    )
}
