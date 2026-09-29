import { describe, expect, test } from 'bun:test'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// Issue #10: with viewport-fit=cover the page runs under the notch and the
// gesture bar, so blocks touching the side edges must use px-safe-N. A plain
// px-N there would put text behind the notch with the phone sideways.
const root = join(import.meta.dir, '..')
const read = (path: string) => readFileSync(join(root, path), 'utf8')

describe('Safe Area', () => {
  test('index.html usa viewport-fit=cover', () => {
    expect(read('index.html')).toMatch(/<meta name="viewport" content="[^"]*viewport-fit=cover/)
  })

  test('topo, rodapé e modal respeitam a área segura', () => {
    expect(read('src/components/Header.tsx')).toContain('pt-safe')
    expect(read('src/components/Footer.tsx')).toContain('pb-safe-')
    expect(read('src/components/CourseModal.tsx')).toContain('dialog-safe')
  })

  test('páginas e seções usam px-safe nas laterais, não px-4 ou sm:px-6', () => {
    const files = ['src/routes', 'src/components'].flatMap((dir) =>
      readdirSync(join(root, dir))
        .filter((name) => name.endsWith('.tsx'))
        .map((name) => `${dir}/${name}`),
    )
    // Form fields have their own inner padding and never touch the edges.
    const layout = files.filter((file) => file !== 'src/components/ContactForm.tsx')
    for (const file of layout) {
      expect({ file, plain: read(file).match(/(?<![\w-])(sm:)?px-(4|6)(?![\w-])/g) }).toEqual({ file, plain: null })
    }
  })
})
