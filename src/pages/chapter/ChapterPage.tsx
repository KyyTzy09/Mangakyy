import { useChapter } from '@/features/chapter/hooks/useChapter'
import { useChapterReader } from '@/features/chapter/hooks/useChapterReader'
import FloatingTopBar from '@/features/chapter/components/reader/FloatingTopBar'
import FloatingBottomBar from '@/features/chapter/components/reader/FloatingBottomBar'
import ChapterEndSheet from '@/features/chapter/components/reader/ChapterEndSheet'
import { defaultImage } from '@/shared/dummy/image'
import { useLoaderData, useNavigate, useRouter } from '@tanstack/react-router'

export default function ChapterPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const { detail, manga } = useLoaderData({ from: '/chapter/$chapterId' })

  const comic = manga?.data
  const chapter = detail?.data

  // Simpan riwayat bacaan
  useChapter({
    chapterId: chapter?.chapter_id || '',
    chapter: chapter!,
    comic: comic!,
  })

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
      navigate({
        to: `/chapter/$chapterId`,
        params: { chapterId: chapter.prev_chapter_id },
      })
    }
  }

  const handleNextChapter = () => {
    if (chapter?.next_chapter_id) {
      navigate({
        to: `/chapter/$chapterId`,
        params: { chapterId: chapter.next_chapter_id },
      })
    }
  }

  // Handler lanjut dari ChapterEndSheet
  const handleContinueChapter = () => {
    dismissChapterEnd()
    if (chapter?.next_chapter_id) {
      navigate({
        to: `/chapter/$chapterId`,
        params: { chapterId: chapter.next_chapter_id },
      })
    }
  }

  return (
    <div
      className="text-white flex flex-col items-center justify-start w-full h-full min-h-screen font-primary"
      {...tapProps}
    >
      {/* Floating Top Bar */}
      <FloatingTopBar
        title={comic?.title || ''}
        chapterNumber={chapter?.chapter_number || 0}
        isVisible={isBarsVisible}
        onBack={() => router.history.back()}
      />

      {/* Gambar Chapter */}
      <section className="flex flex-col w-full max-w-3xl overflow-hidden">
        {chapter?.chapter.data.map((url, i) => {
          return (
            <img
              key={i}
              src={`${chapter?.base_url}/chapter/manga_${chapter?.manga_id}/chapter_${chapter?.chapter_id}/${url}`}
              alt={defaultImage}
              className="flex w-full h-auto select-none pointer-events-none"
            />
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
        mangaId={chapter?.manga_id || ''}
        onContinue={handleContinueChapter}
        onDismiss={dismissChapterEnd}
      />
    </div>
  )
}
