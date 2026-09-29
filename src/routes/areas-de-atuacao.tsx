import { createFileRoute } from '@tanstack/react-router'
import { areasDeAtuacao } from '../../shared/content'
import { PageBanner } from '../components/PageBanner'
import { ServiceGrid } from '../components/ServiceGrid'
import { useAreasDeAtuacaoContent } from '../hooks/useContent'

const TITLE = `${areasDeAtuacao.heading} | Instituto Brasileiro de Treinamento Operacional`

export const Route = createFileRoute('/areas-de-atuacao')({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: areasDeAtuacao.subheading },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: areasDeAtuacao.subheading },
      { property: 'og:url', content: 'https://ib-to.org/areas-de-atuacao' },
    ],
  }),
  component: AreasDeAtuacaoPage,
})

function AreasDeAtuacaoPage() {
  const { data } = useAreasDeAtuacaoContent()

  return (
    <>
      <PageBanner banner={data.banner} />
      <div className="bg-ink px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl text-white sm:text-5xl">{data.heading}</h1>
            <p className="mt-4 text-brand-gold-light">{data.subheading}</p>
          </div>
          <div className="mt-12">
            <ServiceGrid services={data.services} />
          </div>
        </div>
      </div>
    </>
  )
}
