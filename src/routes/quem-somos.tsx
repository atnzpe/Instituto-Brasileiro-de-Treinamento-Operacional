import { createFileRoute } from '@tanstack/react-router'
import { MissionVisionValues } from '../components/MissionVisionValues'
import { TeamCard } from '../components/TeamCard'
import { useQuemSomosContent } from '../hooks/useContent'

export const Route = createFileRoute('/quem-somos')({
  component: QuemSomosPage,
})

function QuemSomosPage() {
  const { data } = useQuemSomosContent()

  return (
    <div className="mx-auto max-w-5xl space-y-20 px-4 py-16 sm:px-6">
      <section>
        <h1 className="text-4xl sm:text-5xl">{data.intro.heading}</h1>
        <div className="mt-6 max-w-3xl space-y-4">
          {data.intro.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-body">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl">{data.oQueFazemos.heading}</h2>
        <div className="mt-6 max-w-3xl space-y-4">
          {data.oQueFazemos.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-body">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <MissionVisionValues mvv={data.missaoVisaoValores} />

      <section>
        <h2 className="text-3xl">Diretoria</h2>
        <div className="mt-8 space-y-8">
          {data.diretoria.map((member) => (
            <TeamCard key={member.slug} member={member} />
          ))}
        </div>
      </section>
    </div>
  )
}
