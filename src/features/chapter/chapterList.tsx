import { Button } from '@/shared/shadcn/button'
import { formatRelativeTime } from '@/shared/utils/dateConverter'
import { Link, useNavigate } from '@tanstack/react-router'
import { motion } from 'motion/react'

interface Props {
    chapterId: string
    image: string
    title: string
    time: Date
}

export default function ChapterList({ chapterId, image, title, time }: Props) {
    const navigate = useNavigate()
    return (
        <motion.div onClick={() => navigate({ to: `/chapter/${chapterId}` })} className="group flex items-center justify-between w-full bg-slate-800 hover:bg-slate-700 transition p-4 rounded-xl mb-2 cursor-pointer">
            <div className="flex gap-4 items-center">
                <img
                    src={image}
                    alt='no-image'
                    className="w- h-14 rounded-lg object-cover"
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
