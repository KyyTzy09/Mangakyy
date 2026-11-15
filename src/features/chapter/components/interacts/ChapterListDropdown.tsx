import type { ChapterList as ChapterListType, ComicType } from '@/shared/interfaces'
import { Label } from '@/shared/shadcn/label'
import { Separator } from '@/shared/shadcn/separator'
import { Loader2, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState   } from 'react'
import type {Dispatch, SetStateAction} from 'react';
import ChapterList from '../cards/chapterList'
import { useGetInfiniteChapter, useSearchChapter } from '../../hooks/chapterQuery'
import { Input } from '@/shared/shadcn/input'
import { useDebounce } from '@/shared/hooks/useDebounce'

interface Props {
  chapters: ChapterListType[]
  comic: ComicType
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  readChapterIds?: Set<string>
  latestChapterId?: string
}

export default function ChapterListDropdown({
  comic,
  isOpen,
  setIsOpen,
  readChapterIds,
  latestChapterId,
}: Props) {
    const [search, setSearch] = useState<string>('')
    const debounce = useDebounce(search, 1000)
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetInfiniteChapter(comic.manga_id)
    const { data: searchResult } = useSearchChapter(comic.manga_id, debounce)
    const isSearch = search.length > 0
    const chapters = isSearch ? searchResult?.data : data?.pages?.flatMap(page => page?.data) ?? []

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ y: 200, opacity: 0 }}
                        animate={{ translateY: 0, opacity: 1 }}
                        exit={{ y: 200, opacity: 0 }}
                        className='fixed top-0 md:top-[20%] md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full h-screen md:w-[40%] max-h-[90vh] flex flex-col items-center justify-between z-[100] bg-[#111]/90 backdrop-blur-xl p-5 gap-5 overflow-hidden rounded-md'>
                        <div className='flex flex-col w-full items-center justify-start gap-5'>
                            <section className='flex items-center justify-between w-full gap-2'>
                                <Label className="text-lg font-semibold">Chapter</Label>
                                <button onClick={() => setIsOpen(false)}>
                                    <X className='w-5 h-5 cursor-pointer' />
                                </button>
                            </section>
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder='Cari chapter'
                                className='w-full'
                            />
                            <Separator className='bg-gray-400/40' />
                            <section
                                onScroll={(e) => {
                                    const el = e.currentTarget
                                    const isBottom =
                                        el.scrollTop + el.clientHeight >=
                                        el.scrollHeight - 20

                                    if (isBottom && hasNextPage && !isFetchingNextPage && !isSearch) {
                                        fetchNextPage()
                                    }
                                }}
                                className="flex flex-col w-full max-h-[60vh] overflow-y-auto">
                                {chapters?.map((chapterItem, i) => (
                                    <ChapterList
                                        key={chapterItem?.chapter_id || i}
                                        index={i}
                                        chapter={chapterItem!}
                                        comic={comic}
                                        isLastRead={latestChapterId === chapterItem?.chapter_id}
                                        isRead={
                                            chapterItem?.chapter_id
                                                ? readChapterIds?.has(String(chapterItem.chapter_id))
                                                : false
                                        }
                                    />
                                ))}
                                <div
                                    className="flex items-center justify-center py-6 w-full min-h-[40px]"
                                >
                                    {isFetchingNextPage && (
                                        <div className="flex items-center gap-2 text-sm text-gray-300">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Loading...
                                        </div>
                                    )}
                                </div>

                            </section>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
