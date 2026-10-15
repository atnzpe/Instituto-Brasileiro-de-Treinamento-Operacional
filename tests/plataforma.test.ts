/**
 * Testes da ligação do site com a plataforma de cursos (src/lib/plataforma.ts,
 * blog #61): cada site conversa com a plataforma do MESMO ambiente.
 * Rodam sem navegador: `bun test`.
 */
import { describe, expect, test } from 'bun:test'
import { enderecoDaPlataforma } from '../src/lib/plataforma'

describe('enderecoDaPlataforma', () => {
  test('site oficial (com ou sem www) → plataforma oficial', () => {
    expect(enderecoDaPlataforma('ib-to.org')).toBe('https://cursos.ib-to.org')
    expect(enderecoDaPlataforma('www.ib-to.org')).toBe('https://cursos.ib-to.org')
  })

  test('site de testes e computador local → plataforma de testes', () => {
    expect(enderecoDaPlataforma('homolog.ib-to.org')).toBe('https://cursos-homolog.ib-to.org')
    expect(enderecoDaPlataforma('localhost:5173')).toBe('https://cursos-homolog.ib-to.org')
  })
})
