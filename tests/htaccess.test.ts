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

  test('bloqueia o arquivo de controle do deploy automático', () => {
    expect(htaccess).toMatch(/<Files "\.ftp-deploy-sync-state\.json">\s*\n\s*Require all denied/)
  })

  test('senha da homologação só em HTTPS e só no homolog.ib-to.org', () => {
    const block = htaccess.match(/<If "([^"]+)">\s*\n\s*AuthMerging And[\s\S]*?<\/If>/)
    expect(block).not.toBeNull()
    // Without the HTTPS condition the password is asked over plain HTTP,
    // before the redirect, and travels unencrypted.
    expect(block![1]).toBe("%{HTTP_HOST} == 'homolog.ib-to.org' && %{HTTPS} == 'on'")
    expect(block![0]).toContain('Require valid-user')
    // The only password requirement in the file is that conditional one.
    expect(htaccess.match(/Require valid-user/g)).toHaveLength(1)
  })

  test('força HTTPS e não deixa a homologação ser indexada', () => {
    expect(htaccess).toContain('RewriteCond %{HTTPS} !=on')
    expect(htaccess).toContain(`<If "%{HTTP_HOST} == 'homolog.ib-to.org'">`)
    expect(htaccess).toContain('X-Robots-Tag "noindex, nofollow"')
  })
})
