import { getChapterList } from '@/api/server/chapter'
import { getMangaDetail } from '@/api/server/manga'
import ChapterHistoryCard from '@/features/chapter/components/cards/ChapterHistoryCard'
import ChapterList from '@/features/chapter/components/cards/chapterList'
import ChapterPagination from '@/features/chapter/components/ChapterPagination'
import ChapterListDropdown from '@/features/chapter/components/interacts/ChapterListDropdown'
import { useGetChapterList } from '@/features/chapter/hooks/chapterQuery'
import Stat from '@/features/manga/components/cards/DetailStatCard'
import Tag from '@/features/manga/components/cards/DetailTagCard'
import { Button } from '@/shared/shadcn/button'
import { Label } from '@/shared/shadcn/label'
import { Separator } from '@/shared/shadcn/separator'
import { displayComicType } from '@/shared/utils/countryConverter'
import { getChapterHistory } from '@/shared/utils/history'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, Home, Play, Star } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'

export const Route = createFileRoute('/detail/$mangaId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const detail = await getMangaDetail({ data: { mangaId: params.mangaId } })
    return {
      detail,
      chapters: await getChapterList({ data: { mangaId: params.mangaId, page: 1 } }),
      meta: { title: `${detail?.data.title}`, description: detail?.data.description, image: detail?.data.cover_image_url }
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
          title: `${data?.meta.title} - MangaKyy`,
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
          content: `${data?.meta.title} - MangaKyy`,
        },
        {
          property: "og:description",
          content:
            "Baca manga, manhwa, dan manhua gratis dengan update terbaru dan koleksi lengkap hanya di Mangakyy.",
        },
        {
          property: "og:image",
          content: `${data?.meta.image}`,
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
          content: `https://mangakyy.com/detail/${data?.detail?.data.manga_id}`,
        },
        // Twitter card
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:title",
          content: `${data?.meta.title} - MangaKyy`,
        },
        {
          name: "twitter:description",
          content:
            "Platform baca manga, manhwa, dan manhua gratis dengan update cepat dan kualitas terbaik.",
        },
        {
          name: "twitter:image",
          content: `${data?.meta.image}`,
        },
        {
          name: "twitter:url",
          content: `https://mangakyy.com/detail/${data?.detail?.data.manga_id}`,
        }
      ]
    }
  },
})

export default function RouteComponent() {
  const { detail, chapters } = Route.useLoaderData()
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)

  const { data: chapterList } = useGetChapterList(chapters!, detail?.data.manga_id!, page)

  const infoCardData = [
    {
      title: "Chapter",
      value: detail?.data.latest_chapter_number,

    },
    {
      title: "Status",
      value: detail?.data.status === 1 ? "Ongoing" : "Completed"
    },
    {
      title: "Type",
      value: displayComicType(detail?.data?.country_id || "")
    }
  ]

  const navigate = useNavigate()
  const router = useRouter()
  const histories = getChapterHistory()
  const history = histories.find((history) => history.mangaId === detail?.data.manga_id)

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-linear-to-br from-[#0f172a] via-[#0b1a33] to-black/80 text-slate-100 pt-20">
      <section className="w-full relative overflow-hidden">
        <header className='relative flex items-center justify-between w-full z-10 max-w-7xl mx-auto px-6 pt-5'>
          <Button
            onClick={() => router.history.back()}
            className='hover:bg-blue-400'
          >
            <ArrowLeft className='flex items-center justify-center font-primary' />
            Kembali
          </Button>
          <Button
            onClick={() => navigate({ to: "/home" })}
            className='hover:bg-blue-400 rounded-full w-10 h-10'
          >
            <Home className='flex items-center justify-center font-primary' />
          </Button>
        </header>
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0 z-0">
          <img
            src={detail?.data.cover_image_url}
            alt="bg"
            className="w-full h-full object-cover blur-md scale-110 opacity-70"
          />
          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-[#0b1a33]/80 to-[#081226]" />
        </div>
        {/* CONTENT */}

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-10">
          <div className="flex flex-col items-center md:items-start md:flex-row gap-8">
            {/* COVER */}
            <div className="flex flex-col items-center justify-center shrink-0 gap-4">
              <img
                src={detail?.data.cover_image_url}
                alt="cover"
                className="rounded-xl shadow-2xl w-[180px] sm:w-[220px] md:w-[240px]" />

              <Button
                onClick={() => navigate({ to: "/chapter/$chapterId", params: { chapterId: detail?.data.latest_chapter_id! } })}
                className="w-full bg-blue-500 hover:bg-blue-600 transition px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Baca Chapter Terbaru
              </Button>
            </div>

            {/* DETAILS */}
            <div className="flex-1">
              {/* Tags */}
              <div className="flex gap-2 mb-3 flex-wrap items-center justify-center md:justify-start">
                {detail?.data.taxonomy.Genre.map(({ name }, i) => (
                  <Tag key={i}>{name}</Tag>
                ))}
              </div>
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-center md:text-start">
                {detail?.data.title}
              </h1>
              {/* Stats */}
              <div className="flex justify-center md:justify-start items-center gap-6 text-sm text-slate-300 mb-6 flex-wrap">
                <Stat Icon={Star} color="text-yellow-400">
                  {detail?.data.user_rate}
                </Stat>
                <Stat Icon={Eye} color="text-green-400">
                  {detail?.data.view_count} Views
                </Stat>
              </div>

              {/* Info Cards */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                {infoCardData.map(({ title, value }, i) => (
                  <InfoCard key={i} title={title}>
                    {value}
                  </InfoCard>
                ))}
              </div>

              {/* Synopsis */}
              <div className="max-w-[700px]">
                <h3 className="font-semibold mb-2">
                  Sinopsis
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {detail?.data.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter */}
      <section className='flex flex-col w-full max-w-7xl min-h-screen items-center justify-start p-8 gap-5'>
        <header className='flex items-center justify-between w-full'>
          <Label className='text-white font-semibold text-xl'>
            Chapter List
          </Label>
          <div className=''>
          </div>
        </header>
        <Separator className='w-full bg-primary' />
        <div className='flex flex-col items-center justify-center w-full h-full'>
          {history && <ChapterHistoryCard history={history} />}
          {chapterList?.data?.map(({ chapter_id, chapter_number, thumbnail_image_url, release_date }, i) => {
            return <ChapterList chapterId={chapter_id} index={i} image={thumbnail_image_url} title={`Chapter ${chapter_number}`} time={new Date(release_date)} mangaId={detail?.data.manga_id} chapterNumber={chapter_number} />
          })}
        </div>
      </section>
      <ChapterPagination page={page} setPage={setPage} chapters={chapterList} setOpen={setOpen} />
      <ChapterListDropdown
        mangaId={detail?.data.manga_id || ""}
        chapters={chapters?.data!}
        isOpen={open}
        setIsOpen={setOpen}
      />
    </main>
  )
}

/* COMPONENTS */

function InfoCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-slate-800 px-4 py-3 rounded-xl min-w-[100px]">
      <div className="text-xs text-slate-400">
        {title}
      </div>
      <div className="font-semibold">
        {children}
      </div>
    </div>
  )
}