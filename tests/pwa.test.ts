/// <reference lib="dom" />
// ↑ src/lib/api.ts is browser code; tsconfig.server.json (which also checks
// tests/) only loads Bun's types.
import { afterEach, describe, expect, test } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { submitContact } from '../src/lib/api'

// Issue #9: offline first + installable app.
const root = join(import.meta.dir, '..')
const read = (path: string) => readFileSync(join(root, path), 'utf8')

const realFetch = globalThis.fetch
const realOnLine = Object.getOwnPropertyDescriptor(globalThis.navigator, 'onLine')

function setOnline(value: boolean) {
  Object.defineProperty(globalThis.navigator, 'onLine', { configurable: true, get: () => value })
}

afterEach(() => {
  globalThis.fetch = realFetch
  if (realOnLine) Object.defineProperty(globalThis.navigator, 'onLine', realOnLine)
})

describe('formulário de contato sem internet', () => {
  test('avisa na hora com SEM_INTERNET e não tenta enviar', async () => {
    let calls = 0
    globalThis.fetch = (async () => {
      calls++
      return new Response('{}')
    }) as unknown as typeof fetch
    setOnline(false)

    const sending = submitContact({ name: 'Maria', email: 'maria@example.com', message: 'Olá' })
    expect(sending).rejects.toThrow('sem internet')
    expect(sending).rejects.toThrow('código: SEM_INTERNET')
    await sending.catch(() => {})
    expect(calls).toBe(0)
  })
})

describe('service worker e manifesto', () => {
  const config = read('vite.config.ts')

  test('nunca guarda o formulário nem a API no cache', () => {
    expect(config).toContain('navigateFallbackDenylist: [/^\\/api\\//, /\\.php$/]')
    const globs = config.match(/globPatterns: \[([^\]]+)\]/)?.[1] ?? ''
    expect(globs).not.toContain('php')
    expect(globs).not.toContain('json')
  })

  test('versão nova assume sozinha depois do deploy', () => {
    expect(config).toContain('skipWaiting: true')
    expect(config).toContain('clientsClaim: true')
  })

  test('ícones do app existem', () => {
    for (const icon of ['icon-192.png', 'icon-512.png', 'maskable-512.png', 'apple-touch-icon.png']) {
      expect(existsSync(join(root, 'public', 'icons', icon))).toBe(true)
    }
  })

  test('VLibras offline não quebra a página', () => {
    expect(read('index.html')).toContain("if (window.VLibras) new window.VLibras.Widget(")
  })
})
