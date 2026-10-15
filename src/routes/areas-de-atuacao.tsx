/*
 * PÁGINA "ÁREAS DE ATUAÇÃO". Desde 15/10/2026 (#57), as áreas vêm da
 * plataforma de cursos (a fonte única: ativar ou desativar uma área no
 * cadastro muda esta página sozinha). Se a plataforma não responder, a página
 * mostra a lista escrita no site (shared/content.ts), e nunca fica vazia.
 */
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { areasDeAtuacao } from '../../shared/content'
import { PageBanner } from '../components/PageBanner'
import { ServiceGrid } from '../components/ServiceGrid'
import { useAreasDeAtuacaoContent } from '../hooks/useContent'
import { buscarAreasDaPlataforma, juntarAreas } from '../lib/plataforma'

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
  // As áreas ativas da plataforma (guardadas por 5 minutos; sem tentar de novo se falhar).
  const { data: daPlataforma } = useQuery({
    queryKey: ['areas-da-plataforma'],
    queryFn: buscarAreasDaPlataforma,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
  // Com resposta da plataforma (e pelo menos uma área): as dela, com as imagens.
  // Sem resposta, carregando ou vazia: a lista escrita no site.
  const areas =
    daPlataforma && daPlataforma.length > 0 ? juntarAreas(daPlataforma, data.services) : data.services

  return (
    <>
      <PageBanner banner={data.banner} />
      <div className="bg-ink px-safe-4 py-16 sm:px-safe-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl text-white sm:text-5xl">{data.heading}</h1>
            <p className="mt-4 text-brand-gold-light">{data.subheading}</p>
          </div>
          <div className="mt-12">
            <ServiceGrid services={areas} />
          </div>
        </div>
      </div>
    </>
  )
}
