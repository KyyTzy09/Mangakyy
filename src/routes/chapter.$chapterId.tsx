import { Separator } from '@/shared/shadcn/separator'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/chapter/$chapterId')({
  component: RouteComponent,
})

function RouteComponent() {
  const image = "https://assets.shngm.id/chapter/manga_07cba925-da21-497e-a5e0-b2ca712917df/chapter_714aaf93-b9bb-4b98-a8aa-d06bcd44efd6/00-342daa.jpg"
  return (
    <div className='text-white flex flex-col items-center justify-start w-full h-full min-h-screen font-primary gap-5'>
      <header className="w-full flex items-center justify-between px-6 py-4 border-b border-white/10 max-w-3xl">

        <Link

          to={`/chapter/${8}`}
          className="px-4 py-2 rounded-md bg-primary text-white hover:bg-blue-400 transition"
        >
          ← Ch. 8
        </Link>

        <div className="text-center">
          <div className="text-sm text-zinc-400">Chapter</div>
          <div className="text-lg font-semibold">9</div>
        </div>

        <Link
          to="/chapter/10"
          className="px-4 py-2 rounded-md bg-primary text-white hover:bg-blue-400 transition"
        >
          Ch. 10 →
        </Link>

      </header>
      <Separator className='bg-gray-500' />
      <section className='flex flex-col w-full max-w-3xl overflow-hidden'>
        {Array.from({ length: 30 }).map(() => {
          return (
            <img src={image} alt="" className='flex w-full h-auto' />
          )
        })}
      </section>
    </div>
  )
}
