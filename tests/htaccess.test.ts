import { describe, expect, test } from 'bun:test'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// Routes that don't need an Apache rule: the root layout, the home page
// (served as the directory index) and the legacy /services URL, which the
// .htaccess redirects on its own.
const NOT_REWRITTEN = new Set(['__root', 'index', 'services'])

const root = join(import.meta.dir, '..')
const htaccess = readFileSync(join(root, 'public', '.htaccess'), 'utf8')

const routeNames = readdirSync(join(root, 'src', 'routes'))
  .filter((file) => file.endsWith('.tsx'))
  .map((file) => file.replace(/\.tsx$/, ''))

// Páginas de um nível (ex.: 'contato') e as listas com página filha
// ('blog.index' vira 'blog'). Páginas com nome variável ('blog.$slug') ficam
// de fora daqui: elas têm a regra própria, conferida no teste de baixo.
const pages = [
  ...new Set(
    routeNames
      .filter((name) => !name.includes('$'))
      .map((name) => name.replace(/\.index$/, ''))
      .filter((name) => !NOT_REWRITTEN.has(name)),
  ),
]

// As seções com página de nome variável. Ex.: 'blog.$slug' → 'blog'.
const slugSections = routeNames.filter((name) => name.includes('.$')).map((name) => name.split('.')[0])

const rewrittenPages = (() => {
  const match = htaccess.match(/RewriteRule \^\(([^)]+)\)\/\?\$ \/index\.html/)
  return match ? match[1].split('|') : []
})()

describe('public/.htaccess', () => {
  test('libera todas as páginas do site (senão elas dão 404 no Apache)', () => {
    expect(rewrittenPages.sort()).toEqual(pages.sort())
  })

  test('libera as páginas com nome variável (ex.: /blog/<slug>), só no formato seguro', () => {
    const match = htaccess.match(/RewriteRule \^\(([^)]+)\)\/\[a-z0-9-\]\+\/\?\$ \/index\.html/)
    expect(match).not.toBeNull()
    expect(match![1].split('|').sort()).toEqual([...new Set(slugSections)].sort())
  })

  test('service worker e manifesto do PWA nunca ficam presos no cache', () => {
    expect(htaccess).toContain('<FilesMatch "^(sw\\.js|registerSW\\.js|workbox-[\\w-]+\\.js|manifest\\.webmanifest)$">')
    expect(htaccess).toContain('AddType application/manifest+json .webmanifest')
  })

  test('bloqueia o acesso ao config.php pela internet', () => {
    expect(htaccess).toContain('<FilesMatch "^config(\\.example)?\\.php$">')
    expect(htaccess).toContain('Require all denied')
  })

  test('HSTS usa %{HTTPS}, não env=HTTPS (a HostGator não define a variável)', () => {
    expect(htaccess).toMatch(
      /<If "%\{HTTPS\} == 'on'">\s*\n\s*Header always set Strict-Transport-Security "max-age=\d+"\s*\n\s*<\/If>/,
    )
    expect(htaccess).not.toContain('env=HTTPS')
  })

  test('bloqueia o arquivo de controle do deploy automático', () => {
    expect(htaccess).toMatch(/<Files "\.ftp-deploy-sync-state\.json">\s*\n\s*Require all denied/)
  })

  // Piloto (17/10/2026): a homologação não tem mais a janelinha de usuário e senha.
  // Se alguém recolocar sem querer, este teste avisa (e aí é para mudar o teste de propósito).
  test('homologação sem janelinha de senha (piloto, 17/10/2026)', () => {
    expect(htaccess).not.toContain('AuthType Basic')
    expect(htaccess).not.toContain('Require valid-user')
  })

  test('força HTTPS e não deixa a homologação ser indexada', () => {
    expect(htaccess).toContain('RewriteCond %{HTTPS} !=on')
    expect(htaccess).toContain(`<If "%{HTTP_HOST} == 'homolog.ib-to.org'">`)
    expect(htaccess).toContain('X-Robots-Tag "noindex, nofollow"')
  })
})
