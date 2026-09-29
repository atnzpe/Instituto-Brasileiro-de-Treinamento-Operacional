import { createFileRoute } from '@tanstack/react-router'
import { cursos } from '../../shared/content'
import { CourseGrid } from '../components/CourseGrid'
import { useCursosContent } from '../hooks/useContent'

const TITLE = `${cursos.heading} | Instituto Brasileiro de Treinamento Operacional`

export const Route = createFileRoute('/cursos')({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: cursos.subheading },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: cursos.subheading },
      { property: 'og:url', content: 'https://ib-to.org/cursos' },
    ],
  }),
  component: CursosPage,
})

function CursosPage() {
  const { data } = useCursosContent()

  return (
    <div className="bg-ink px-safe-4 py-16 sm:px-safe-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-4xl text-white sm:text-5xl">{data.heading}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-brand-gold-light">{data.subheading}</p>
        </div>
        <div className="mt-12">
          <CourseGrid data={data} />
        </div>
      </div>
    </div>
  )
}
