/**
 * ÁREAS DE ATUAÇÃO na página inicial (16/10/2026): os emblemas das áreas,
 * vindos da plataforma (#57), em vez de três parágrafos genéricos. Uma imagem
 * diz mais rápido "o que se aprende aqui" do que um texto longo.
 *
 * Se a plataforma não responder, usa a lista do próprio site: a seção nunca
 * fica vazia.
 */
import { useQuery } from '@tanstack/react-query'
import { areasDeAtuacao, type HomeContent } from '../../shared/content'
import { buscarAreasDaPlataforma, juntarAreas } from '../lib/plataforma'
import { BotaoDeAcao } from './BotaoDeAcao'
import { ServiceGrid } from './ServiceGrid'

// Quantos emblemas mostrar na página inicial: duas linhas de 5 na tela larga.
const MAXIMO_NA_HOME = 10

/**
 * Desenha a seção.
 *
 * @param teaser Os textos e a ação. Ex.: { eyebrow: 'ÁREAS DE ATUAÇÃO', heading: '...', ... }
 * @returns A seção com os emblemas e o botão "Ver todas as áreas".
 */
export function AreasTeaser({ teaser }: { teaser: HomeContent['areasTeaser'] }) {
  // A mesma consulta da página de áreas (mesma chave): a resposta é aproveitada entre as duas.
  const { data: daPlataforma } = useQuery({
    queryKey: ['areas-da-plataforma'],
    queryFn: buscarAreasDaPlataforma,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
  // Com resposta da plataforma: as áreas dela (com as imagens do site de reserva). Sem: a lista do site.
  const areas =
    daPlataforma && daPlataforma.length > 0
      ? juntarAreas(daPlataforma, areasDeAtuacao.services)
      : areasDeAtuacao.services

  return (
    <section aria-labelledby="t-areas" className="px-safe-4 py-20 sm:px-safe-6">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-sm font-semibold tracking-[0.2em] text-brand-gold-light">{teaser.eyebrow}</p>
        <h2 id="t-areas" className="mt-3 text-3xl text-white sm:text-4xl">
          {teaser.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/70">{teaser.intro}</p>
        <div className="mt-12">
          <ServiceGrid services={areas.slice(0, MAXIMO_NA_HOME)} />
        </div>
        <div className="mt-12">
          <BotaoDeAcao acao={teaser.cta} versao="secundario" />
        </div>
      </div>
    </section>
  )
}
