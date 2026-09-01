import { getChapterDetail } from '@/api/server/chapter'
import { getMangaDetail } from '@/api/server/manga'
import { useChapter } from '@/features/chapter/hooks/useChapter'
import { useChapterReader } from '@/features/chapter/hooks/useChapterReader'
import FloatingTopBar from '@/features/chapter/components/reader/FloatingTopBar'
import FloatingBottomBar from '@/features/chapter/components/reader/FloatingBottomBar'
import ChapterEndSheet from '@/features/chapter/components/reader/ChapterEndSheet'
import { defaultImage } from '@/shared/dummy/image'
import { createFileRoute, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/chapter/$chapterId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const detail = await getChapterDetail({ data: { chapterId: params.chapterId } })
    const manga = await getMangaDetail({ data: { mangaId: detail?.data.manga_id || "" } })
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
          content: `${data?.meta.title} - Mangakyy`,
        },
        {
          property: "og:description",
          content: data?.meta.description,
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
          content: `https://mangakyy.com/chapter/${data?.detail?.data.chapter_id}`,
        },
        // Twitter card
        {
          name: "twitter:card",
          content: data?.meta.image,
        },
        {
          name: "twitter:title",
          content: `${data?.meta.title} - MangaKyy`,
        },
        {
          name: "twitter:image",
          content: data?.meta.image,
        },
        {
          name: "twitter:description",
          content: data?.meta.description,
        },
        {
          name: "twitter:url",
          content: `https://mangakyy.com/chapter/${data?.detail?.data.chapter_id}`,
        }
      ]
    }
  }
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const router = useRouter()
  const { detail, manga } = Route.useLoaderData()

  const comic = manga?.data
  const chapter = detail?.data

  // Simpan riwayat bacaan (existing logic — tidak berubah)
  useChapter({ chapterId: chapter?.chapter_id || "", chapter: chapter!, comic: comic! })

  // Hook pusat untuk floating reader navigation
  const {
    isBarsVisible,
    isAutoScrolling,
    scrollSpeed,
    isSpeedMode,
    isChapterEnd,
    tapProps,
    toggleAutoScroll,
    setScrollSpeed,
    enterSpeedMode,
    exitSpeedMode,
    dismissChapterEnd,
  } = useChapterReader()

  // Handler navigasi chapter
  const handlePrevChapter = () => {
    if (chapter?.prev_chapter_id) {
      navigate({ to: `/chapter/$chapterId`, params: { chapterId: chapter.prev_chapter_id } })
    }
  }

  const handleNextChapter = () => {
    if (chapter?.next_chapter_id) {
      navigate({ to: `/chapter/$chapterId`, params: { chapterId: chapter.next_chapter_id } })
    }
  }

  // Handler lanjut dari ChapterEndSheet
  const handleContinueChapter = () => {
    dismissChapterEnd()
    if (chapter?.next_chapter_id) {
      navigate({ to: `/chapter/$chapterId`, params: { chapterId: chapter.next_chapter_id } })
    }
  }

  return (
    <div
      className='text-white flex flex-col items-center justify-start w-full h-full min-h-screen font-primary'
      {...tapProps}
    >
      {/* Floating Top Bar */}
      <FloatingTopBar
        title={comic?.title || ""}
        chapterNumber={chapter?.chapter_number || 0}
        isVisible={isBarsVisible}
        onBack={() => router.history.back()}
      />

      {/* Gambar Chapter */}
      <section className='flex flex-col w-full max-w-3xl overflow-hidden'>
        {chapter?.chapter.data.map((url, i) => {
          return (
            <img key={i} src={`${chapter?.base_url}/chapter/manga_${chapter?.manga_id}/chapter_${chapter?.chapter_id}/${url}`} alt={defaultImage} className='flex w-full h-auto select-none pointer-events-none' />
          )
        })}
      </section>

      {/* Floating Bottom Bar */}
      <FloatingBottomBar
        isVisible={isBarsVisible}
        isSpeedMode={isSpeedMode}
        isAutoScrolling={isAutoScrolling}
        scrollSpeed={scrollSpeed}
        prevChapterId={chapter?.prev_chapter_id || null}
        prevChapterNumber={chapter?.prev_chapter_number || null}
        nextChapterId={chapter?.next_chapter_id || null}
        nextChapterNumber={chapter?.next_chapter_number || null}
        onPrev={handlePrevChapter}
        onNext={handleNextChapter}
        onToggleAutoScroll={toggleAutoScroll}
        onEnterSpeedMode={enterSpeedMode}
        onExitSpeedMode={exitSpeedMode}
        onSpeedChange={setScrollSpeed}
      />

      {/* Chapter End Sheet */}
      <ChapterEndSheet
        isVisible={isChapterEnd}
        chapterNumber={chapter?.chapter_number || 0}
        nextChapterId={chapter?.next_chapter_id || null}
        nextChapterNumber={chapter?.next_chapter_number || null}
        mangaId={chapter?.manga_id || ""}
        onContinue={handleContinueChapter}
        onDismiss={dismissChapterEnd}
      />
    </div>
  )
}
