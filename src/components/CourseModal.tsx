import { Link } from '@tanstack/react-router'
import { Fragment, useEffect, useId, useRef } from 'react'
import type { Course, CourseAccessModel, CursosContent } from '../../shared/content'
import { CourseAccessBadge } from './CourseAccessBadge'

const ctaClassName =
  'inline-block rounded-full bg-brand-gold px-8 py-3 text-center text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-gold-light hover:text-ink'

const whatsappHref = (phone: string, title: string) =>
  `https://wa.me/55${phone.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Olá, vi o curso ${title} no site ib-to.org e gostaria de mais informações`,
  )}`

interface CourseModalProps {
  course: Course | null
  accessModel: CourseAccessModel | undefined
  cta: CursosContent['cta']
  onClose: () => void
}

export function CourseModal({ course, accessModel, cta, onClose }: CourseModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  const facts: [label: string, value: string][] = []
  if (course?.format) facts.push(['Formato', course.format])
  if (course?.location) facts.push(['Local', course.location])
  if (course?.schedule) facts.push(['Datas e horário', course.schedule])
  if (course?.instructor) facts.push(['Instrutor', course.instructor])
  if (course?.workload) facts.push(['Carga horária', course.workload])
  if (course?.price) facts.push(['Investimento', course.price])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (course && !dialog.open) dialog.showModal()
    if (!course && dialog.open) dialog.close()
  }, [course])

  useEffect(() => {
    if (!course) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [course])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close()
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-white/10 bg-ink p-0 text-white backdrop:bg-black/80"
    >
      {course && (
        <div className="relative p-6 sm:p-8">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Fechar"
            className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full text-2xl leading-none text-white/70 transition-colors hover:text-white"
          >
            <span aria-hidden="true">×</span>
          </button>

          <div className="pr-8">
            {accessModel ? (
              <CourseAccessBadge model={accessModel} />
            ) : (
              <span className="inline-block rounded-full border border-white/20 px-3 py-1 text-xs font-semibold tracking-wide text-white/70">
                Modalidade a definir
              </span>
            )}
            <h2 id={titleId} className="mt-4 text-2xl text-white">
              {course.title}
            </h2>
          </div>

          <p className="mt-4 text-white/70">
            {course.summary ?? 'A descrição completa deste curso será divulgada em breve.'}
          </p>
          {accessModel && (
            <p className="mt-3 text-sm text-brand-gold-light">{accessModel.description}</p>
          )}

          {facts.length > 0 && (
            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              {facts.map(([label, value]) => (
                <Fragment key={label}>
                  <dt className="text-white/50">{label}</dt>
                  <dd className="text-white">{value}</dd>
                </Fragment>
              ))}
            </dl>
          )}

          {course.modules && course.modules.length > 0 && (
            <>
              <h3 className="mt-6 text-sm text-brand-gold-light uppercase">Módulos</h3>
              <ul className="mt-2 space-y-2 text-sm">
                {course.modules.map((module) => (
                  <li key={module.title}>
                    <span className="text-white">{module.title}</span>
                    <span className="block text-white/70">{module.instructor}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {course.topics && course.topics.length > 0 && (
            <>
              <h3 className="mt-6 text-sm text-brand-gold-light uppercase">Conteúdo</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/80 marker:text-brand-gold-light">
                {course.topics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </>
          )}

          {course.includes && course.includes.length > 0 && (
            <>
              <h3 className="mt-6 text-sm text-brand-gold-light uppercase">Materiais inclusos</h3>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm">
                {course.includes.map((item) => (
                  <li key={item} className="rounded-full border border-white/15 px-3 py-1 text-white/80">
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {course.whatsapp && course.whatsapp.length > 0 ? (
              course.whatsapp.map((phone) => (
                <a
                  key={phone}
                  href={whatsappHref(phone, course.title)}
                  target="_blank"
                  rel="noreferrer"
                  className={ctaClassName}
                >
                  WhatsApp {phone}
                </a>
              ))
            ) : (
              <Link to={cta.href} className={ctaClassName}>
                {cta.label}
              </Link>
            )}
          </div>
        </div>
      )}
    </dialog>
  )
}
