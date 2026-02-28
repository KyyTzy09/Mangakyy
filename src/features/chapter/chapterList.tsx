import { Button } from '@/shared/shadcn/button'
import { formatRelativeTime } from '@/shared/utils/dateConverter'
import { Link } from '@tanstack/react-router'

interface Props {
    chapterId: string
    image: string
    title: string
    time: Date
}

export default function ChapterList({ chapterId, image, title, time }: Props) {
    return (
        <Link to={`/chapter/${chapterId}`} className="group flex items-center justify-between w-full bg-slate-800 hover:bg-slate-700 transition p-4 rounded-xl mb-2 cursor-pointer">
            <div className="flex gap-4 items-center">
                <img
                    src={image}
                    alt='no-image'
                    className="w-14 h-14 rounded-lg"
                />
                <div>
                    <div className="font-medium">
                        {title}
                    </div>

                    <div className="text-sm text-slate-400">
                        {formatRelativeTime(time)}
                    </div>
                </div>
            </div>

            <Button className="text-slate-400 group-hover:text-white hover:bg-blue-400">
                Baca
            </Button>
        </Link>
    )
}
