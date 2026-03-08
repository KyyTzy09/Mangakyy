import { Button } from '@/shared/shadcn/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

interface Props {
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    chapters: any
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ChapterPagination({ page, setPage, chapters, setOpen }: Props) {
    return (
        <section className='flex items-center justify-center w-full gap-4 pb-5'>
            <Button
                disabled={page === 1}
                onClick={() => {
                    setPage(page - 1)
                    scrollTo({ top: 0, behavior: "smooth" })
                }}
                className='bg-transparent border border-primary/90'>
                <ChevronLeft className='w-4 h-4' />
            </Button>
            <Button
                onClick={() => setOpen(true)}
            >
                {page}
            </Button>
            <Button
                disabled={page === chapters?.meta.total_page}
                onClick={() => {
                    setPage(page + 1)
                    scrollTo({ top: 0, behavior: "smooth" })
                }}
                className='bg-transparent  border border-primary/90'>
                <ChevronRight className='w-4 h-4 ' />
            </Button>
        </section>
    )
}
