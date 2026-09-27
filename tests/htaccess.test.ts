import { describe, expect, test } from 'bun:test'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// Routes that don't need an Apache rule: the root layout, the home page
// (served as the directory index) and the legacy /services URL, which the
// .htaccess redirects on its own.
const NOT_REWRITTEN = new Set(['__root', 'index', 'services'])

const root = join(import.meta.dir, '..')
const htaccess = readFileSync(join(root, 'public', '.htaccess'), 'utf8')

const pages = readdirSync(join(root, 'src', 'routes'))
  .filter((file) => file.endsWith('.tsx'))
  .map((file) => file.replace(/\.tsx$/, ''))
  .filter((name) => !NOT_REWRITTEN.has(name))

const rewrittenPages = (() => {
  const match = htaccess.match(/RewriteRule \^\(([^)]+)\)\/\?\$ \/index\.html/)
  return match ? match[1].split('|') : []
})()

describe('public/.htaccess', () => {
  test('libera todas as páginas do site (senão elas dão 404 no Apache)', () => {
    expect(rewrittenPages.sort()).toEqual(pages.sort())
  })

  test('bloqueia o acesso ao config.php pela internet', () => {
    expect(htaccess).toContain('<FilesMatch "^config(\\.example)?\\.php$">')
    expect(htaccess).toContain('Require all denied')
  })

  test('força HTTPS e não deixa a homologação ser indexada', () => {
    expect(htaccess).toContain('RewriteCond %{HTTPS} !=on')
    expect(htaccess).toContain(`<If "%{HTTP_HOST} == 'homolog.ib-to.org'">`)
    expect(htaccess).toContain('X-Robots-Tag "noindex, nofollow"')
  })
})
