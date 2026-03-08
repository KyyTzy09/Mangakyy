import { getPopularManga, getRecommendationManga, getUpdateManga } from '@/api/server/manga'
import CarouselSection from '@/features/manga/components/sections/CarouselSection'
import LatestSection from '@/features/manga/components/sections/LatestSection'
import PopularSection from '@/features/manga/components/sections/PopularSection'
import RecommendationSection from '@/features/manga/components/sections/RecommendationSection'
import type { ComicType } from '@/shared/interfaces'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home')({
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
                title: "Home-Mangakyy",
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
                content: "Home - Mangakyy",
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
                content: "https://mangakyy.com/home",
            },

            // Twitter card
            {
                name: "twitter:card",
                content: "summary_large_image",
            },
            {
                name: "twitter:title",
                content: "Mangakyy - Baca Manga, Manhwa, dan Manhua Gratis",
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
                content: "https://mangakyy.com/home",
            }
        ]
    }),
    loader: async () => {
        const recommendation = await getRecommendationManga({ data: { format: "manga" } })
        return {
            recommendation,
            popular: await getPopularManga({ data: { type: "all_time" } }),
            update: await getUpdateManga({ data: { type: "project" } })
        }
    }
})

function RouteComponent() {
    const { recommendation, popular, update } = Route.useLoaderData()
    return (
        <div className='font-primary flex flex-col w-full min-h-screen px-2 md:px-20 pt-16 md:pt-20'>
            <div className='flex flex-col w-full h-full gap-10 bg-linear-to-b from-transparent via-black to-primary px-2 sm:px-5 py-14 overflow-hidden'>
                <div className='w-full'>
                    <CarouselSection recommendations={recommendation?.data || []} />
                </div>
                <div className='flex flex-col items-start justify-between lg:flex-row w-full h-auto gap-5'>
                    <div className='flex flex-col w-[100%] lg:w-[68%] min-h-screen gap-5'>
                        <RecommendationSection recommendation={recommendation?.data as ComicType[]} />
                        <PopularSection popular={popular?.data!} />
                    </div>
                    <div className=' lg:w-[32%] h-full bg-[#232323] text-white rounded-md'>
                        <LatestSection latest={update?.data || []} />
                    </div>
                </div>
            </div>
        </div>
    )
}
