import { getPopularManga } from '@/api/server/manga'
import PopularCard from '@/features/manga/components/cards/PopularCard'
import { useGetPopularManga } from '@/features/manga/hooks/MangaQuery'
import PaginationSection from '@/shared/components/reusable/pagination'
import { Label } from '@/shared/shadcn/label'
import { createFileRoute } from '@tanstack/react-router'
import { Flame } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/popular')({
    component: RouteComponent,
    head: () => ({
        meta: [
            {
                charSet: "utf-8",
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            {
                title: "Popular - Mangakyy",
            },
            {
                name: "description",
                content:
                    "Mangakyy adalah platform untuk membaca manga, manhwa, dan manhua gratis dengan update cepat dan koleksi lengkap. Temukan berbagai genre seperti action, romance, fantasy, dan banyak lagi dengan kualitas terbaik.",
            },
            {
                name: "keywords",
                content:
                    "manga, manhwa, manhua, baca manga online, manga gratis, manhwa gratis, manhua gratis, komik online, mangakyy",
            },
            {
                name: "author",
                content: "Mangakyy",
            },
            {
                name: "robots",
                content: "index, follow",
            },

            // Open Graph (buat preview Discord, Facebook, dll)
            {
                property: "og:title",
                content: "Popular - Mangakyy",
            },
            {
                property: "og:description",
                content:
                    "Baca manga, manhwa, dan manhua gratis dengan update terbaru dan koleksi lengkap hanya di Mangakyy.",
            },
            {
                property: "og:type",
                content: "website",
            },
            {
                property: "og:site_name",
                content: "Mangakyy",
            },
            {
                property: "og:image",
                content: "/mangakyy-logo.png"
            },
            {
                property: "og:url",
                content: "https://mangakyy.my.id/popular",
            },

            // Twitter card
            {
                name: "twitter:card",
                content: "summary_large_image",
            },
            {
                name: "twitter:title",
                content: "Popular - Mangakyy",
            },
            {
                name: "twitter:description",
                content:
                    "Platform baca manga, manhwa, dan manhua gratis dengan update cepat dan kualitas terbaik.",
            },
            {
                name: "twitter:image",
                content: "/mangakyy-logo.png"
            },
            {
                name: "twitter:url",
                content: "https://mangakyy.my.id/popular",
            }
        ]
    }),
    loader: async () => {
        return {
            popular: await getPopularManga({ data: { type: "all_time", page: 1, pageSize: 20 } })
        }
    }
})

function RouteComponent() {
    const { popular } = Route.useLoaderData()
    const [currentPage, setCurrentPage] = useState(1)

    const { data, isPending } = useGetPopularManga("all_time", popular?.data, currentPage, 20)
    return (
        <div className='font-primary flex flex-col w-full min-h-screen px-6 py-24 gap-5'>
            <header className='flex flex-col md:flex-row items-center justify-between w-full gap-2'>
                <Label className='text-white font-semibold text-2xl'>
                    <Flame className='w-6 h-6 text-primary' />
                    Komik Populer
                </Label>
            </header>
            <section className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 w-full gap-3'>
                {!isPending && data?.map((data, i) => (
                    <PopularCard key={i} index={i} data={data} />
                ))}
            </section>
            <PaginationSection
                totalPage={popular?.meta?.total_page || 1}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    )
}
