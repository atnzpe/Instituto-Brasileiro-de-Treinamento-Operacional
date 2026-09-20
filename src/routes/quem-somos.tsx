import { createFileRoute } from '@tanstack/react-router'
import { quemSomos } from '../../shared/content'
import { MissionVisionValues } from '../components/MissionVisionValues'
import { TeamCard } from '../components/TeamCard'
import { useQuemSomosContent } from '../hooks/useContent'

const TITLE = `${quemSomos.intro.heading} | Instituto Brasileiro de Treinamento Operacional`
const DESCRIPTION =
  'Conheça o IBTO: história, missão, visão, valores e a diretoria por trás da formação operacional de alto nível no Brasil.'

export const Route = createFileRoute('/quem-somos')({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:url', content: 'https://ib-to.org/quem-somos' },
    ],
  }),
  component: QuemSomosPage,
})

function QuemSomosPage() {
  const { data } = useQuemSomosContent()

  return (
    <div className="bg-ink px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-20">
        <section>
          <h1 className="text-4xl text-white sm:text-5xl">{data.intro.heading}</h1>
          <div className="mt-6 max-w-3xl space-y-4">
            {data.intro.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-white/70">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl text-white">{data.oQueFazemos.heading}</h2>
          <div className="mt-6 max-w-3xl space-y-4">
            {data.oQueFazemos.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-white/70">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <MissionVisionValues mvv={data.missaoVisaoValores} />

        <section>
          <h2 className="text-3xl text-white">Diretoria</h2>
          <div className="mt-8 space-y-8">
            {data.diretoria.map((member) => (
              <TeamCard key={member.slug} member={member} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
