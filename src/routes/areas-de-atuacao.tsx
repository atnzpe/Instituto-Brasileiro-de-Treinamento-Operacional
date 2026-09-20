import { createFileRoute } from '@tanstack/react-router'
import { ServiceGrid } from '../components/ServiceGrid'
import { useAreasDeAtuacaoContent } from '../hooks/useContent'

export const Route = createFileRoute('/areas-de-atuacao')({
  component: AreasDeAtuacaoPage,
})

function AreasDeAtuacaoPage() {
  const { data } = useAreasDeAtuacaoContent()

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl">{data.heading}</h1>
        <p className="mt-4 text-body">{data.subheading}</p>
      </div>
      <div className="mt-12">
        <ServiceGrid services={data.services} />
      </div>
    </div>
  )
}
