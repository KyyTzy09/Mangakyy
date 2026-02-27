import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/update/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/update"!</div>
}
