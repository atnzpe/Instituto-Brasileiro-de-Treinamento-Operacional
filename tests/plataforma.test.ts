/**
 * Testes da ligação do site com a plataforma de cursos (src/lib/plataforma.ts,
 * blog #61): cada site conversa com a plataforma do MESMO ambiente.
 * Rodam sem navegador: `bun test`.
 */
import { describe, expect, test } from 'bun:test'
import { enderecoDaPlataforma, linkDaPlataforma, precoBr } from '../src/lib/plataforma'

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

describe('linkDaPlataforma', () => {
  test('fora do navegador (testes) usa a plataforma de testes, com o caminho', () => {
    expect(linkDaPlataforma('/login')).toBe('https://cursos-homolog.ib-to.org/login')
  })
})

describe('precoBr', () => {
  test('zero é gratuito; o resto em reais', () => {
    expect(precoBr(0)).toBe('Gratuito')
    // O Intl usa um espaço especial depois do "R$": troca por espaço comum para comparar.
    expect(precoBr(25000).replace(/\s/g, ' ')).toBe('R$ 250,00')
  })
})
