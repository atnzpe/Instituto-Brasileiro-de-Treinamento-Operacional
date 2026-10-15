import { createFileRoute } from '@tanstack/react-router'
import { AreasTeaser } from '../components/AreasTeaser'
import { FeatureCards } from '../components/FeatureCards'
import { Hero } from '../components/Hero'
import { QuemSomosTeaser } from '../components/QuemSomosTeaser'
import { SecondaryBanner } from '../components/SecondaryBanner'
import { TrainingSection } from '../components/TrainingSection'
import { UltimasDoIbto } from '../components/UltimasDoIbto'
import { useHomeContent } from '../hooks/useContent'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { data: home } = useHomeContent()

  return (
    <div className="bg-ink">
      <Hero hero={home.hero} />
      <FeatureCards features={home.features} />
      <TrainingSection training={home.training} />
      {/* Últimas do blog, vindas da plataforma de cursos (#61); some se a plataforma não responder. */}
      <UltimasDoIbto />
      <SecondaryBanner banner={home.banner} />
      <QuemSomosTeaser teaser={home.quemSomosTeaser} />
      <AreasTeaser teaser={home.areasTeaser} />
    </div>
  )
}
