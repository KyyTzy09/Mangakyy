import { getChapterDetail } from '@/api/server/chapter'
import { getMangaDetail } from '@/api/server/manga'
import { defaultImage } from '@/shared/dummy/image'
import { Button } from '@/shared/shadcn/button'
import { Separator } from '@/shared/shadcn/separator'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { ArrowLeft, Book } from 'lucide-react'

export const Route = createFileRoute('/chapter/$chapterId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const detail = await getChapterDetail({ data: { chapterId: params.chapterId } })
    const manga = await getMangaDetail({ data: { mangaId: detail?.data.manga_id! } })
    return {
      detail,
      manga,
      meta: { title: `${manga?.data.title}-Ch.${detail?.data?.chapter_number}`, description: manga?.data.description, image: manga?.data.cover_image_url }
    }
  },
  head: async ({ loaderData }) => {
    const data = loaderData
    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          title: data?.meta.title,
        },
        {
          name: "description",
          content:
            `${data?.meta.description}`,
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
          content: data?.meta.title,
        },
        {
          property: "og:description",
          content: data?.meta.title,
        },
        {
          property: "og:image",
          content: data?.meta.image,
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
          property: "og:url",
          content: "https://mangakyy.com",
        },
        // Twitter card
        {
          name: "twitter:card",
          content: data?.meta.image,
        },
        {
          name: "twitter:title",
          content: data?.meta.title,
        },
        {
          name: "twitter:image",
          content: data?.meta.image,
        },
        {
          name: "twitter:description",
          content: data?.meta.description,
        },
      ]
    }
  }
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const router = useRouter()
  const { detail } = Route.useLoaderData()

  return (
    <div className='text-white flex flex-col items-center justify-start w-full h-full min-h-screen font-primary gap-3'>
      <header className="w-full flex items-center justify-between p-4 max-w-3xl">
        <Button
          onClick={() => navigate({ to: `/chapter/$chapterId`, params: { chapterId: detail?.data.prev_chapter_id! } })}
          className="px-4 py-2 rounded-md bg-primary text-white hover:bg-blue-400 transition"
          disabled={detail?.data.chapter_number === 1}
        >
          {detail?.data.chapter_number !== 1 ? `← Ch. ${detail?.data.prev_chapter_number}` : "Ch. 1"}
        </Button>

        <div className="text-center">
          <div className="text-sm text-zinc-400">Chapter</div>
          <div className="text-lg font-semibold">{detail?.data.chapter_number}</div>
        </div>

        <Button
          onClick={() => navigate({ to: `/chapter/$chapterId`, params: { chapterId: detail?.data.next_chapter_id! } })}
          className="px-4 py-2 rounded-md bg-primary text-white hover:bg-blue-400 transition"
          disabled={!detail?.data.next_chapter_number}
        >
          {detail?.data.next_chapter_id ? `Ch. ${detail?.data.next_chapter_number} →` : "Chapter Terakhir"}
        </Button>
      </header>
      <Separator className='bg-gray-500' />
      {/* View */}
      <div className='relative flex items-center justify-between w-full z-10 max-w-3xl p-4'>
        <Button
          onClick={() => router.history.back()}
          className='hover:bg-blue-400'
        >
          <ArrowLeft className='flex items-center justify-center font-primary' />
          Kembali
        </Button>
        <Button
          onClick={() => navigate({ to: "/read/$mangaId", params: { mangaId: detail?.data.manga_id || "" } })}
          className='hover:bg-blue-400 rounded-full w-10 h-10'
        >
          <Book className='flex items-center justify-center font-primary' />
        </Button>
      </div>
      <section className='flex flex-col w-full max-w-3xl overflow-hidden'>
        {detail?.data.chapter.data.map((url) => {
          return (
            <img src={`${detail?.data.base_url}/chapter/manga_${detail?.data.manga_id}/chapter_${detail.data.chapter_id}/${url}`} alt={defaultImage} className='flex w-full h-auto' />
          )
        })}
      </section>
      <section className="w-full flex items-center justify-between p-4 max-w-3xl">
        <Button
          onClick={() => navigate({ to: `/chapter/$chapterId`, params: { chapterId: detail?.data.prev_chapter_id! } })}
          className="px-4 py-2 rounded-md bg-primary text-white hover:bg-blue-400 transition"
          disabled={detail?.data.chapter_number === 1}
        >
          {detail?.data.chapter_number !== 1 ? `← Ch. ${detail?.data.prev_chapter_number}` : "Ch. 1"}
        </Button>

        <div className="text-center">
          <div className="text-sm text-zinc-400">Chapter</div>
          <div className="text-lg font-semibold">{detail?.data.chapter_number}</div>
        </div>

        <Button
          onClick={() => navigate({ to: `/chapter/$chapterId`, params: { chapterId: detail?.data.next_chapter_id! } })}
          className="px-4 py-2 rounded-md bg-primary text-white hover:bg-blue-400 transition"
          disabled={!detail?.data.next_chapter_number}
        >
          {detail?.data.next_chapter_id ? `Ch. ${detail?.data.next_chapter_number} →` : "Chapter Terakhir"}
        </Button>
      </section>
    </div >
  )
}
