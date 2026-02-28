import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chapter/$chapterId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/chapter/$chapterId"!</div>
}
