import type { Course, CourseStatus } from '../../shared/content'

// The classes happen in Brazil, so "today" must be the Brazilian date: using
// UTC would close a course three hours early (21h in Recife is already the
// next day in UTC). Recife and São Paulo share UTC−3 with no daylight saving.
export function todayInBrazil(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Recife',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

// `endsAt` is the last day of the class, so the course stays open through
// that whole day and only closes on the following one.
export function courseStatus(course: Course, today: string = todayInBrazil()): CourseStatus {
  if (course.endsAt && today > course.endsAt) return 'encerrado'
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
