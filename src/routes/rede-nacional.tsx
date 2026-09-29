import { createFileRoute } from '@tanstack/react-router'
import { redeNacional, type Representative } from '../../shared/content'
import { RepresentativeCard } from '../components/RepresentativeCard'
import { useRedeNacionalContent } from '../hooks/useContent'

const TITLE = `${redeNacional.heading} | Instituto Brasileiro de Treinamento Operacional`

export const Route = createFileRoute('/rede-nacional')({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: redeNacional.subheading },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: redeNacional.subheading },
      { property: 'og:url', content: 'https://ib-to.org/rede-nacional' },
    ],
  }),
  component: RedeNacionalPage,
})

function groupByState(list: Representative[]) {
  const groups: Record<string, Representative[]> = {}
  for (const person of list) {
    ;(groups[person.state] ??= []).push(person)
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
}

function RedeNacionalPage() {
  const { data } = useRedeNacionalContent()
  const byState = groupByState(data.representantes)

  return (
    <div className="bg-ink px-safe-4 py-16 sm:px-safe-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-4xl text-white sm:text-5xl">{data.heading}</h1>
          <p className="mt-4 text-brand-gold-light">{data.subheading}</p>
        </div>

        <div className="mt-12">
          {byState.length === 0 ? (
            <p className="mx-auto max-w-md text-center text-white/70">
              Rede em expansão — em breve, representantes, instrutores e centros de treinamento
              credenciados aparecerão aqui, organizados por estado.
            </p>
          ) : (
            <div className="space-y-12">
              {byState.map(([state, people]) => (
                <section key={state}>
                  <h2 className="text-2xl text-white">{state}</h2>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {people.map((person) => (
                      <RepresentativeCard key={`${person.name}-${person.city}`} person={person} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
