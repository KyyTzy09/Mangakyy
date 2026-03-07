import { defaultImage } from '@/shared/dummy/image'
import { Button } from '@/shared/shadcn/button'
import { formatRelativeTime } from '@/shared/utils/dateConverter'
import { useNavigate } from '@tanstack/react-router'
import { motion } from 'motion/react'

interface Props {
    chapterId: string
    image: string
    title: string
    time: Date
    index: number
}

export default function ChapterList({ chapterId, image, title, time, index }: Props) {
    const navigate = useNavigate()
    return (
        <motion.div
            initial={{ translateY: 10 }}
            animate={{ translateY: 0 }}
            exit={{ translateY: 10 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate({ to: `/chapter/$chapterId`, params: { chapterId } })}
            className="group flex items-center justify-between w-full bg-slate-800 hover:bg-slate-700 transition p-4 rounded-xl mb-2 cursor-pointer">
            <div className="flex gap-4 items-center">
                <img
                    src={image || defaultImage}
                    alt={"No-image"}
                    className="flex items-center justify-center w-auto h-14 rounded-lg object-cover bg-gray-600"
                />
                <div>
                    <div className="font-medium">
                        {title}
                    </div>

                    <div className="text-sm text-slate-400">
                        {formatRelativeTime(time, true)}
                    </div>
                </div>
            </div>

            <Button className="text-slate-400 group-hover:text-white hover:bg-blue-400">
                Baca
            </Button>
        </motion.div>
    )
}
