import { motion } from 'motion/react'

interface Props {
    count: number
}

export default function GenreMangaCardSkeleton({ count }: Props) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <motion.div
                    key={index}
                    initial={{ translateY: 10 }}
                    animate={{ translateY: 0 }}
                    exit={{ translateY: 10 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col w-full bg-[#232323] rounded-md overflow-hidden text-sm animate-pulse"
                >
                    {/* FLAG */}
                    <div className="absolute top-0 right-1 w-6 h-6 bg-gray-600 rounded"></div>

                    {/* IMAGE */}
                    <div className="w-full h-52 sm:h-64 md:h-60 bg-gray-700"></div>

                    {/* INFO */}
                    <div className="flex flex-col items-center justify-between w-full gap-2 p-2">

                        {/* TITLE */}
                        <div className="flex flex-col gap-1 w-full items-center">
                            <div className="h-3 w-3/4 bg-gray-600 rounded"></div>
                            <div className="h-3 w-1/2 bg-gray-600 rounded"></div>
                        </div>

                        {/* BADGES */}
                        <div className="flex items-center justify-center w-full gap-2">
                            <div className="h-6 w-14 bg-gray-600 rounded"></div>
                            <div className="h-6 w-12 bg-gray-600 rounded"></div>
                        </div>

                    </div>
                </motion.div>
            ))}
        </>
    )
}
