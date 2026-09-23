import { useState } from 'react'
import type { Course, CursosContent } from '../../shared/content'
import { CourseAccessBadge } from './CourseAccessBadge'
import { CourseModal } from './CourseModal'

export function CourseGrid({ data }: { data: CursosContent }) {
  const [selected, setSelected] = useState<Course | null>(null)
  const modelFor = (course: Course | null) =>
    data.accessModels.find((model) => model.id === course?.access)

  return (
    <>
      <ul aria-label="Modalidades de acesso" className="flex flex-wrap justify-center gap-3">
        {data.accessModels.map((model) => (
          <li
            key={model.id}
            className="rounded-full bg-brand-gold px-5 py-2 text-sm font-semibold text-white"
          >
            {model.label}
          </li>
        ))}
      </ul>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.cursos.map((course, index) => {
          const model = modelFor(course)
          return (
            <li key={course.slug}>
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => setSelected(course)}
                className={`flex min-h-28 w-full flex-col items-start justify-between gap-4 rounded-xl border border-white/10 p-5 text-left transition-colors hover:border-brand-gold-light/60 ${
                  index % 2 === 0 ? 'bg-brand-gold/20' : 'bg-white/5'
                }`}
              >
                <span>
                  <span className="block font-display text-lg text-white">{course.title}</span>
                  {[course.format, course.location].some(Boolean) && (
                    <span className="mt-1 block text-sm text-white/70">
                      {[course.format, course.location].filter(Boolean).join(' · ')}
                    </span>
                  )}
                  {course.schedule && (
                    <span className="block text-sm text-white/70">{course.schedule}</span>
                  )}
                </span>
                <span className="flex w-full items-center justify-between gap-2">
                  {model ? (
                    <CourseAccessBadge model={model} />
                  ) : (
                    <span className="text-xs text-white/50">Modalidade a definir</span>
                  )}
                  <span className="text-sm font-semibold text-brand-gold-light">Ver detalhes</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <p className="mt-8 text-center text-sm text-white/70">{data.footnote}</p>

      <CourseModal
        course={selected}
        accessModel={modelFor(selected)}
        cta={data.cta}
        onClose={() => setSelected(null)}
      />
    </>
  )
}
