/**
 * PÁGINA INICIAL DO SITE (reorganizada em 16/10/2026 com conceitos de web design).
 *
 * Cada seção tem UMA mensagem e nenhuma repete a outra:
 * 1. Topo: quem é, para quem é e o que fazer (Ver cursos / Fale com o IBTO).
 * 2. Por que o IBTO: três diferenciais (só informam; sem seta).
 * 3. Próximos cursos: até 3, vindos da plataforma, e "Ver todos os cursos".
 * 4. Áreas de atuação: os emblemas, vindos da plataforma.
 * 5. Últimas do IBTO: o blog (some se a plataforma não responder).
 * 6. Quem somos: um parágrafo e "Conheça o IBTO".
 * 7. Convite final: as mesmas ações do topo.
 */
import { createFileRoute } from '@tanstack/react-router'
import { AreasTeaser } from '../components/AreasTeaser'
import { FeatureCards } from '../components/FeatureCards'
import { Hero } from '../components/Hero'
import { ProximosCursos } from '../components/ProximosCursos'
import { QuemSomosTeaser } from '../components/QuemSomosTeaser'
import { SecondaryBanner } from '../components/SecondaryBanner'
import { UltimasDoIbto } from '../components/UltimasDoIbto'
import { useHomeContent } from '../hooks/useContent'

export const Route = createFileRoute('/')({
  component: HomePage,
})

/**
 * A página inicial.
 *
 * @returns As sete seções, na ordem acima.
 */
function HomePage() {
  const { data: home } = useHomeContent()

  return (
    <div className="bg-ink">
      <Hero hero={home.hero} />
      <FeatureCards features={home.features} />
      <ProximosCursos secao={home.proximosCursos} />
      <AreasTeaser teaser={home.areasTeaser} />
      <UltimasDoIbto />
      <QuemSomosTeaser teaser={home.quemSomosTeaser} />
      <SecondaryBanner banner={home.banner} />
    </div>
  )
}
