import type { Course, CourseStatus } from '../../shared/content'

// The classes happen in Brazil, so "today" must be the Brazilian date: using
// UTC would close a course three hours early (21h in Recife is already the
// next day in UTC). Recife and São Paulo share UTC−3 with no daylight saving.
// Built from formatToParts because the order/separators of a formatted date
// come from the browser's locale data and are not guaranteed.
export function todayInBrazil(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Recife',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? ''
  return `${part('year')}-${part('month')}-${part('day')}`
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

// `endsAt` is compared as text, which only works for a real YYYY-MM-DD date;
// anything else (e.g. '2026-10-1' or '11/10/2026') is ignored so the course
// falls back to its manual status instead of closing on the wrong day.
export function isValidEndsAt(value: string): boolean {
  if (!ISO_DATE.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

// True only when the class really took place: `endsAt` is the last day, so
// the course stays open through that whole day and ends on the next one.
export function hasEnded(course: Course, today: string = todayInBrazil()): boolean {
  return Boolean(course.endsAt && isValidEndsAt(course.endsAt) && today > course.endsAt)
}

export function courseStatus(course: Course, today: string = todayInBrazil()): CourseStatus {
  if (hasEnded(course, today)) return 'encerrado'
  return course.status ?? 'aberto'
}

export const statusLabel: Record<CourseStatus, string> = {
  aberto: 'Pré-inscrições abertas',
  'em-breve': 'Em breve',
  encerrado: 'Encerrado',
}

const statusOrder: Record<CourseStatus, number> = { aberto: 0, 'em-breve': 1, encerrado: 2 }

// Open classes first, then upcoming, then closed; keeps the original order
// inside each group.
export function sortByStatus(courses: Course[], today: string = todayInBrazil()): Course[] {
  return courses
    .map((course, index) => ({ course, index, order: statusOrder[courseStatus(course, today)] }))
    .sort((a, b) => a.order - b.order || a.index - b.index)
    .map(({ course }) => course)
}
