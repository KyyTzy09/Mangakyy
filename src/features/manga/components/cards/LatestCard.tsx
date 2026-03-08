import type { ComicType, UpdateComic } from '@/shared/interfaces'
import { displayCountryName } from '@/shared/utils/countryConverter'
import { formatRelativeTime } from '@/shared/utils/dateConverter'
import { useNavigate } from '@tanstack/react-router'
import { Bookmark, Clock, Eye, Globe, Star } from 'lucide-react'
import { motion } from 'motion/react'

interface Props {
    data: UpdateComic
    index: number
}

export default function LatestCard({ data, index }: Props) {
    const navigate = useNavigate()
    const { manga_id, title, cover_image_url: cover, release_year: year, description, user_rate: rating, view_count: views, bookmark_count: saves, country_id: country, updated_at: updatedAgo, taxonomy: { Genre: genres } } = data

    return (
        <motion.article
            initial={{ translateY: 10 }}
            animate={{ translateY: 0 }}
            exit={{ translateY: 10 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate({ to: "/read/$mangaId", params: { mangaId: manga_id } })}
            className="group relative w-full min-h-full max-w-md"
        >
            {/* glow border */}
            <div className="absolute -inset-px rounded-2xl bg-linear-to-r from-primary/0 via-primary/40 to-primary/0 bg-clip-border opacity-0 blur transition duration-500 group-hover:opacity-100" />

            {/* card */}
            <div className="relative flex gap-4 rounded-2xl bg-linear-to-br from-[#0f172a] via-[#0b1220] to-[#090f1a] group-hover:from-transparent group-hover:via-black group-hover:to-primary p-4 backdrop-blur-xl border border-white/5 transition duration-500 group-hover:border-primary/30">

                {/* shimmer effect */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="absolute -left-full top-0 h-full w-1/2 bg-linear-to-r from-transparent via-white/5 to-transparent group-hover:animate-shimmer" />
                </div>

                {/* cover */}
                <div className="relative">
                    <img
                        src={cover}
                        alt='No-image'
                        className="h-36 w-24 rounded-lg object-cover shadow-lg transition duration-500 group-hover:scale-105"
                    />

                    {/* status badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs backdrop-blur">
                        <div className="h-2 w-2 rounded-full bg-green-400" />

                    </div>

                    {/* year */}
                    <div className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-xs backdrop-blur">
                        {year}
                    </div>
                </div>

                {/* content */}
                <div className="flex flex-col flex-1 gap-2">
                    <h3 className="text-lg line-clamp-2 font-semibold text-white group-hover:text-primary transition">
                        {title}
                    </h3>

                    <p className="text-sm text-gray-400 line-clamp-2">
                        {description}
                    </p>

                    {/* stats */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-300">

                        <div className="flex items-center gap-1">
                            <Star size={14} className="text-yellow-400" />
                            {rating.toFixed(1)}
                        </div>

                        <div className="flex items-center gap-1">
                            <Eye size={14} className="text-blue-400" />
                            {views.toLocaleString()}
                        </div>

                        <div className="flex items-center gap-1">
                            <Bookmark size={14} className="text-pink-400" />
                            {saves.toLocaleString()}
                        </div>

                    </div>

                    {/* genres */}
                    <div className="flex flex-wrap gap-2 mt-1">
                        {genres?.map((genre) => (
                            <span
                                key={genre?.slug}
                                className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-gray-300 border border-white/10 group-hover:border-primary/40 transition"
                            >
                                {genre?.name}
                            </span>
                        ))}
                    </div>
                    {/* footer */}
                    <div className="flex items-center justify-between mt-2 text-[10px] sm:text-xs text-gray-400">
                        <div className="flex items-center gap-1 text-primary">
                            <Globe className='w-3 h-3 sm:w-4 sm:h-4' />
                            {displayCountryName(country.toUpperCase())}
                        </div>

                        <div className="flex items-center gap-1">
                            <Clock className='w-3 h-3 sm:w-4 sm:h-4' />
                            {formatRelativeTime(updatedAgo)}
                        </div>

                    </div>

                </div>
            </div>
        </motion.article>
    )
}
