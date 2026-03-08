import { getUpdateManga } from '@/api/server/manga'
import MangaUpdateCard from '@/features/manga/components/cards/UpdateCard'
import UpdateCardSkeleton from '@/features/manga/components/skeletons/UpdateCardSkeleton'
import { useGetUpdateManga } from '@/features/manga/hooks/MangaQuery'
import PaginationSection from '@/shared/components/reusable/pagination'
import { Button } from '@/shared/shadcn/button'
import { Label } from '@/shared/shadcn/label'
import { createFileRoute } from '@tanstack/react-router'
import { Timer } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/update')({
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
        title: "Update - Mangakyy",
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
        content: "Update - Mangakyy",
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
        content: "https://mangakyy.my.id/update",
      },

      // Twitter card
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "Update - Mangakyy",
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
        content: "https://mangakyy.my.id/update",
      }
    ]
  }),
  loader: async () => ({
    data: await getUpdateManga({ data: { type: "mirror", page: 1, pageSize: 17 } })
  })
})

const updateType = [
  {
    title: "Mirror",
    value: "mirror"
  },
  {
    title: "Project",
    value: "project"
  }
]

function RouteComponent() {
  const [selectedType, setSelectedType] = useState<"mirror" | "project">("mirror")
  const [page, setPage] = useState<number>(1)
  const { data } = Route.useLoaderData()
  const { data: update, isPending } = useGetUpdateManga(data!, selectedType, page)
  return (
    <div className='flex items-start justify-start min-h-screen bg-linear-to-br from-[#0f172a] via-[#0b1a33] to-black/80 text-slate-100 pt-20 md:pt-24 p-2 gap-2'>
      <aside className='hidden md:flex flex-col w-70 h-fit max-h-[85vh] sticky top-24 bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 gap-5 overflow-y-auto'>
        <div className='flex flex-col items-center justify-start w-full gap-2'>
          <Label className="text-sm font-semibold">Genre</Label>
          <div className='flex flex-col w-full gap-2'>
            {updateType.map((u, i) => (
              <Button key={i}
                onClick={() => setSelectedType(u.value as "mirror" | "project")}
                className={`${selectedType === u.value ? "bg-primary" : "bg-white/10"} w-full text-start hover:bg-white/20 text-sm py-2 px-3 rounded-md`}>
                {u.title}
              </Button>
            ))}
          </div>
        </div>
      </aside>
      <main className='flex flex-col items-center justify-start w-full md:w-3/4 min-h-screen bg-black/20 backdrop-blur-sm border-gray-200/50 border rounded-md p-3 px-3 md:px-5 gap-5'>
        <section className='flex items-center justify-between w-full'>
          <Label className="text-lg font-semibold">
            <Timer className='w-5 h-5 text-pink-500' />
            Update Komik
          </Label>
        </section>
        <section className='flex md:hidden flex-col w-full gap-2'>
          {updateType.map((u, i) => (
            <Button key={i}
              onClick={() => setSelectedType(u.value as "mirror" | "project")}
              className={`${selectedType === u.value ? "bg-primary" : "bg-white/10"} w-full text-start hover:bg-white/20 text-sm py-2 px-3 rounded-md`}>
              {u.title}
            </Button>
          ))}
        </section>
        <section className='flex w-full items-center justify-center'>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 w-full max-h-screen overflow-y-auto gap-3'>
            {!isPending ? update?.data.map((data, i) => (
              <MangaUpdateCard
                key={i}
                data={data}
                index={i}
              />
            )) : <UpdateCardSkeleton count={15} />}
          </div>
        </section>
        <PaginationSection
          totalPage={update?.meta?.total_page! || 1}
          currentPage={page}
          setCurrentPage={setPage}
        />
      </main>
    </div>
  )
}
