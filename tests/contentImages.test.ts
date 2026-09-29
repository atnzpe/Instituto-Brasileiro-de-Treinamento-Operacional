import { describe, expect, test } from 'bun:test'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { home } from '../shared/content'

const publicDir = join(import.meta.dir, '..', 'public')

describe('imagens da home', () => {
  const cards = [...home.features, ...home.training.cards]

  test.each(cards.filter((card) => card.image).map((card) => [card.title, card.image!]))(
    '%s: a foto existe em public/ e tem texto alternativo',
    (_title, image) => {
      expect(existsSync(join(publicDir, image.src))).toBe(true)
      expect(image.alt.trim().length).toBeGreaterThan(0)
    },
  )
})
