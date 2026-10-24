/**
 * Testes da ligação do site com a plataforma de cursos (src/lib/plataforma.ts,
 * blog #61): cada site conversa com a plataforma do MESMO ambiente.
 * Rodam sem navegador: `bun test`.
 */
import { describe, expect, test } from 'bun:test'
import {
  IMAGEM_PADRAO_DA_AREA,
  contarPorUf,
  enderecoDaPlataforma,
  juntarAreas,
  linkDaPlataforma,
  precoBr,
} from '../src/lib/plataforma'

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

describe('juntarAreas', () => {
  const reserva = [
    { title: 'Combate Corpo-a-corpo', image: '/images/services/combate-corpo-a-corpo.webp' },
    { title: 'Selva', image: '/images/services/selva.webp' },
  ]

  test('a ordem e os nomes vêm da plataforma; a imagem, na ordem: plataforma, site, padrão', () => {
    const areas = juntarAreas(
      [
        { nome: 'Selva', imagem_url: 'https://cursos.ib-to.org/imagens/areas-atuacao/3' },
        // Mesmo nome com acento/traço diferente: acha a imagem do site.
        { nome: 'Combate Corpo a Corpo', imagem_url: null },
        { nome: 'Área nova', imagem_url: null },
      ],
      reserva,
    )

    expect(areas).toEqual([
      { title: 'Selva', image: 'https://cursos.ib-to.org/imagens/areas-atuacao/3' },
      { title: 'Combate Corpo a Corpo', image: '/images/services/combate-corpo-a-corpo.webp' },
      { title: 'Área nova', image: IMAGEM_PADRAO_DA_AREA },
    ])
  })
})

describe('contarPorUf (Rede Nacional, #11)', () => {
  test('conta as pessoas de cada estado; estado sem ninguém não aparece', () => {
    const pessoa = { nome: 'A', nivel: null, equipe: null, uf: 'PE', areas: [], foto_url: '' }
    expect(
      contarPorUf([
        { uf: 'PE', estado: 'Pernambuco', pessoas: [pessoa, pessoa] },
        { uf: 'BA', estado: 'Bahia', pessoas: [pessoa] },
      ]),
    ).toEqual({ PE: 2, BA: 1 })
    expect(contarPorUf([])).toEqual({})
  })
})
