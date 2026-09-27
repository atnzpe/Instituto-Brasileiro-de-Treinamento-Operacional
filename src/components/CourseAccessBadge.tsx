import type { CourseAccess, CourseAccessModel } from '../../shared/content'

const styles: Record<CourseAccess, string> = {
  'gratuito-filiados': 'border-emerald-300/40 bg-emerald-300/10 text-emerald-300',
  'pago-publico': 'border-brand-gold-light/40 bg-brand-gold-light/10 text-brand-gold-light',
  'pago-filiados': 'border-sky-300/40 bg-sky-300/10 text-sky-300',
}

export function CourseAccessBadge({ model }: { model: CourseAccessModel }) {
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${styles[model.id]}`}
    >
      {model.badge}
    </span>
  )
}
