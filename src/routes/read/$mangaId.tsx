import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/read/$mangaId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { useParams } = Route
  const { mangaId } = useParams()
  return (<div className='text-white'>manga Id: {mangaId}</div>)
}
