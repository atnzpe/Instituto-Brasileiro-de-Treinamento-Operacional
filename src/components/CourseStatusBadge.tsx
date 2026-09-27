import type { CourseStatus } from '../../shared/content'
import { statusLabel } from '../lib/courseStatus'

const styles: Record<CourseStatus, string> = {
  aberto: 'border-emerald-300/40 bg-emerald-300/10 text-emerald-300',
  'em-breve': 'border-brand-gold-light/40 bg-brand-gold-light/10 text-brand-gold-light',
  encerrado: 'border-white/25 bg-white/5 text-white/80',
}

export function CourseStatusBadge({ status }: { status: CourseStatus }) {
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${styles[status]}`}
    >
      {statusLabel[status]}
    </span>
  )
}
