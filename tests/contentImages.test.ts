/**
 * Testes das IMAGENS e das AÇÕES da página inicial: a foto do topo existe, e
 * todo botão de ação tem texto e destino (nenhum botão leva a lugar nenhum).
 */
import { describe, expect, test } from 'bun:test'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { home } from '../shared/content'

const publicDir = join(import.meta.dir, '..', 'public')

describe('página inicial', () => {
  test('a foto do topo existe em public/', () => {
    expect(existsSync(join(publicDir, home.hero.image))).toBe(true)
  })

  test('as fotos dos diferenciais existem e têm texto alternativo', () => {
    for (const card of home.features) {
      expect(card.image).toBeDefined()
      expect(existsSync(join(publicDir, card.image!.src))).toBe(true)
      expect(card.image!.alt.trim().length).toBeGreaterThan(20)
    }
  })

  test('todo botão de ação tem texto e destino', () => {
    const acoes = [
      ...home.hero.ctas,
      home.proximosCursos.cta,
      home.areasTeaser.cta,
      home.quemSomosTeaser.cta,
      ...home.banner.ctas,
    ]
    for (const acao of acoes) {
      expect(acao.label.trim().length).toBeGreaterThan(0)
      expect(acao.href.startsWith('/')).toBe(true)
    }
  })

  test('nenhum título ou frase se repete entre as seções', () => {
    const frases = [
      home.hero.eyebrow,
      home.hero.subheading,
      home.proximosCursos.heading,
      home.proximosCursos.intro,
      home.areasTeaser.heading,
      home.areasTeaser.intro,
      home.quemSomosTeaser.heading,
      home.quemSomosTeaser.paragraph,
      home.banner.heading.join(' '),
      home.banner.body,
      ...home.features.map((card) => card.description),
    ].map((frase) => frase.toLowerCase())
    expect(new Set(frases).size).toBe(frases.length)
  })

  // Só a "Atuação Nacional" leva a outra página (a Rede Nacional, já com credenciados
  // no ar); os outros diferenciais só informam, para nenhum cartão levar a lugar nenhum.
  test('só a Atuação Nacional tem link, e ele leva à Rede Nacional', () => {
    const comLink = home.features.filter((card) => card.href)
    expect(comLink.map((card) => [card.title, card.href])).toEqual([
      ['Atuação Nacional', '/rede-nacional'],
    ])
  })
})
