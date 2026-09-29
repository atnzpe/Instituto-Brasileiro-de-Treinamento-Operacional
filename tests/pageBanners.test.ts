import { describe, expect, test } from 'bun:test'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { areasDeAtuacao, contato, quemSomos } from '../shared/content'

// Issue #20: each inner page shows the original site's banner. PageBanner
// asks for two sizes, so a missing file would be a broken image on phones or
// on desktops only.
const publicDir = join(import.meta.dir, '..', 'public')

describe('banners das páginas internas', () => {
  const pages = { 'Áreas de Atuação': areasDeAtuacao, 'Quem Somos': quemSomos, Contato: contato }

  for (const [page, content] of Object.entries(pages)) {
    test(`${page}: as duas versões do banner existem`, () => {
      for (const width of [800, 1600]) {
        expect(existsSync(join(publicDir, `${content.banner.src}-${width}.webp`))).toBe(true)
      }
    })

    test(`${page}: banner tem texto alternativo`, () => {
      expect(content.banner.alt.trim().length).toBeGreaterThan(20)
    })
  }
})
