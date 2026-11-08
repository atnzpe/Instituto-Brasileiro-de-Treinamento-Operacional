import { Link } from '@tanstack/react-router'
import { Fragment, useEffect, useId, useRef } from 'react'
import type { Course, CourseAccessModel, CourseStatus, CursosContent } from '../../shared/content'
import { CourseAccessBadge } from './CourseAccessBadge'
import { CourseStatusBadge } from './CourseStatusBadge'

const ctaClassName =
  'inline-block rounded-full bg-brand-gold px-8 py-3 text-center text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-gold-light hover:text-ink'

const whatsappHref = (phone: string, title: string) =>
  `https://wa.me/55${phone.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Olá, vi o curso ${title} no site ib-to.org e gostaria de fazer minha pré-inscrição`,
  )}`

interface CourseModalProps {
  course: Course | null
  status: CourseStatus
  // Whether the class date has passed; a course can also be closed by hand
  // before its date (full or cancelled class), which needs a different message.
  ended: boolean
  accessModel: CourseAccessModel | undefined
  cta: CursosContent['cta']
  onClose: () => void
}

export function CourseModal({ course, status, ended, accessModel, cta, onClose }: CourseModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const closed = status === 'encerrado'

  const facts: [label: string, value: string][] = []
  if (course?.format) facts.push(['Formato', course.format])
  if (course?.location) facts.push(['Local', course.location])
  if (course?.schedule) facts.push(['Datas e horário', course.schedule])
  if (course?.instructor) facts.push(['Instrutor', course.instructor])
  if (course?.workload) facts.push(['Carga horária', course.workload])
  if (course?.price && !closed) facts.push(['Investimento', course.price])

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
      className="dialog-safe m-auto max-w-lg rounded-2xl border border-white/10 bg-ink p-0 text-white backdrop:bg-black/80"
    >
      {course && (
        // Simetria militar (08/11/2026): tudo no eixo central (text-center), e o
        // botão de fechar no CENTRO do topo, não no canto direito.
        <div className="relative p-6 text-center sm:p-8">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Fechar"
            className="absolute top-2 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full text-2xl leading-none text-white/70 transition-colors hover:text-white"
          >
            <span aria-hidden="true">×</span>
          </button>

          {course.poster && (
            <img
              src={course.poster.src}
              alt={course.poster.alt}
              loading="lazy"
              className="mt-8 mb-6 max-h-80 w-full rounded-xl object-contain"
            />
          )}

          {/* Etiquetas no centro. mt-8: o espaço do botão de fechar, em cima. */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <CourseStatusBadge status={status} />
            {accessModel ? (
              <CourseAccessBadge model={accessModel} />
            ) : (
              <span className="inline-block rounded-full border border-white/20 px-3 py-1 text-xs font-semibold tracking-wide text-white/70">
                Modalidade a definir
              </span>
            )}
          </div>
          <h2 id={titleId} className="mt-4 text-2xl text-white">
            {course.title}
          </h2>

          <p className="mt-4 text-white/70">
            {course.summary ?? 'A descrição completa deste curso será divulgada em breve.'}
          </p>
          {accessModel && (
            <p className="mt-3 text-sm text-brand-gold-light">{accessModel.description}</p>
          )}

          {facts.length > 0 && (
            // Cada informação em duas linhas no centro: o nome pequeno em cima
            // (ex.: "Local") e o valor embaixo (ex.: "Recife - PE").
            <dl className="mt-6 space-y-2 text-sm">
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
              {/* Sem bolinha à esquerda (list-none): cada tópico no centro. */}
              <ul className="mt-2 list-none space-y-1 text-sm text-white/80">
                {course.topics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </>
          )}

          {course.includes && course.includes.length > 0 && (
            <>
              <h3 className="mt-6 text-sm text-brand-gold-light uppercase">Materiais inclusos</h3>
              <ul className="mt-2 flex flex-wrap justify-center gap-2 text-sm">
                {course.includes.map((item) => (
                  <li key={item} className="rounded-full border border-white/15 px-3 py-1 text-white/80">
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}

          {closed ? (
            <p className="mt-8 rounded-xl border border-white/15 bg-white/5 p-4 text-sm text-white/80">
              {ended
                ? 'Esta turma já aconteceu. Novas datas serão divulgadas aqui.'
                : 'As inscrições para esta turma estão encerradas. Novas datas serão divulgadas aqui.'}
            </p>
          ) : (
            // Botões de inscrição no centro (justify-center).
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              {course.whatsapp && course.whatsapp.length > 0 ? (
                course.whatsapp.map((phone) => (
                  <a
                    key={phone}
                    href={whatsappHref(phone, course.title)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Pré-inscrição pelo WhatsApp no número ${phone} (abre em nova aba)`}
                    className={ctaClassName}
                  >
                    Pré-inscrição · {phone}
                  </a>
                ))
              ) : (
                <Link to={cta.href} className={ctaClassName}>
                  {cta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </dialog>
  )
}
