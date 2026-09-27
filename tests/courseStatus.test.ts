import { describe, expect, test } from 'bun:test'
import { cursos, type Course } from '../shared/content'
import {
  courseStatus,
  hasEnded,
  isValidEndsAt,
  sortByStatus,
  todayInBrazil,
} from '../src/lib/courseStatus'

const recife: Course = {
  slug: 'recife',
  title: 'Turma do Recife',
  status: 'aberto',
  endsAt: '2026-10-11',
}

describe('todayInBrazil', () => {
  test('usa o horário de Recife, não o UTC', () => {
    // 11/10 às 23h30 em Recife já é 12/10 em UTC.
    expect(todayInBrazil(new Date('2026-10-12T02:30:00Z'))).toBe('2026-10-11')
  })

  test('vira o dia à meia-noite de Recife', () => {
    expect(todayInBrazil(new Date('2026-10-12T03:00:00Z'))).toBe('2026-10-12')
  })

  test('sempre devolve AAAA-MM-DD', () => {
    expect(todayInBrazil(new Date('2026-01-05T15:00:00Z'))).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('isValidEndsAt', () => {
  test('aceita só datas reais no formato AAAA-MM-DD', () => {
    expect(isValidEndsAt('2026-10-11')).toBe(true)
    expect(isValidEndsAt('2026-10-1')).toBe(false)
    expect(isValidEndsAt('11/10/2026')).toBe(false)
    expect(isValidEndsAt('2026-02-30')).toBe(false)
  })

  test('data mal formatada não encerra o curso: vale o status manual', () => {
    const malFormatado: Course = { slug: 'x', title: 'X', status: 'aberto', endsAt: '2026-10-1' }
    expect(courseStatus(malFormatado, '2026-10-05')).toBe('aberto')
    expect(hasEnded(malFormatado, '2026-10-05')).toBe(false)
  })
})

describe('catálogo real (shared/content.ts)', () => {
  test('todo endsAt cadastrado está no formato AAAA-MM-DD', () => {
    for (const curso of cursos.cursos) {
      if (curso.endsAt !== undefined) expect(isValidEndsAt(curso.endsAt)).toBe(true)
    }
  })
})

describe('courseStatus', () => {
  test('continua aberto até o último dia da turma, inclusive', () => {
    expect(courseStatus(recife, '2026-10-10')).toBe('aberto')
    expect(courseStatus(recife, '2026-10-11')).toBe('aberto')
  })

  test('vira encerrado no dia seguinte ao fim da turma', () => {
    expect(courseStatus(recife, '2026-10-12')).toBe('encerrado')
  })

  test('curso sem data segue o status manual', () => {
    expect(courseStatus({ slug: 'a', title: 'A', status: 'em-breve' }, '2030-01-01')).toBe('em-breve')
    expect(courseStatus({ slug: 'b', title: 'B' }, '2030-01-01')).toBe('aberto')
  })

  test('status manual "encerrado" vale mesmo antes da data, sem contar como turma realizada', () => {
    expect(courseStatus({ ...recife, status: 'encerrado' }, '2026-10-01')).toBe('encerrado')
    expect(hasEnded({ ...recife, status: 'encerrado' }, '2026-10-01')).toBe(false)
  })
})

describe('sortByStatus', () => {
  test('abertos primeiro, depois em breve, depois encerrados, mantendo a ordem dentro do grupo', () => {
    const courses: Course[] = [
      { slug: 'passado', title: 'Passado', endsAt: '2026-01-01' },
      { slug: 'breve', title: 'Breve', status: 'em-breve' },
      { slug: 'aberto-1', title: 'Aberto 1' },
      { slug: 'aberto-2', title: 'Aberto 2' },
    ]
    expect(sortByStatus(courses, '2026-09-27').map((c) => c.slug)).toEqual([
      'aberto-1',
      'aberto-2',
      'breve',
      'passado',
    ])
  })
})
