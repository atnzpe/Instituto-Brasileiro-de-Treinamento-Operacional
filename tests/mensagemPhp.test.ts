import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'bun:test'
import { copyFileSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Runs public/mensagem.php on PHP's built-in server and checks the abuse
// protections from issue #19. The CI runner (ubuntu-24.04) ships PHP; locally
// the XAMPP binary works too. Without PHP the tests are skipped, except in CI.
const php =
  process.env.PHP_BIN ??
  Bun.which('php') ??
  (existsSync('C:/xampp/php/php.exe') ? 'C:/xampp/php/php.exe' : null)
const skip = !php && !process.env.CI

const root = join(import.meta.dir, '..')
const workDir = mkdtempSync(join(tmpdir(), 'ibto-contact-'))
const limitsDir = join(workDir, 'limits')
const port = 18000 + Math.floor(Math.random() * 1000)
const url = `http://127.0.0.1:${port}/mensagem.php`
let server: ReturnType<typeof Bun.spawn> | undefined

// Stand-in for the Resend API: answers with fakeStatus and counts the calls,
// so a "sent" message never leaves this machine.
let fakeStatus = 200
let fakeCalls = 0
const fakeResend = Bun.serve({
  port: 0,
  fetch() {
    fakeCalls++
    const body = fakeStatus === 200 ? '{"id":"test"}' : '{"message":"domain not verified"}'
    return new Response(body, { status: fakeStatus })
  },
})

// mensagem.php reads config.php on every request, so tests can swap it.
function writeConfig(apiKey: string) {
  writeFileSync(
    join(workDir, 'config.php'),
    [
      '<?php',
      `define('RESEND_API_KEY', '${apiKey}');`,
      `define('RESEND_API_URL', '${fakeResend.url}emails');`,
      `define('RATE_LIMIT_DIR', ${JSON.stringify(limitsDir)});`,
      '',
    ].join('\n'),
  )
}

const valid = { name: 'Maria Teste', email: 'maria@example.com', message: 'Olá, quero saber dos cursos.' }

function post(body: unknown, headers: Record<string, string> = {}) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

describe.skipIf(skip)('public/mensagem.php', () => {
  beforeAll(async () => {
    copyFileSync(join(root, 'public', 'mensagem.php'), join(workDir, 'mensagem.php'))
    writeConfig('test-key')
    server = Bun.spawn([php!, '-S', `127.0.0.1:${port}`, '-t', workDir], {
      stdout: 'ignore',
      stderr: 'ignore',
    })
    for (let i = 0; i < 50; i++) {
      try {
        await fetch(url)
        return
      } catch {
        await Bun.sleep(100)
      }
    }
    throw new Error('O servidor PHP não subiu')
  })

  afterAll(() => {
    server?.kill()
    fakeResend.stop(true)
    rmSync(workDir, { recursive: true, force: true })
  })

  beforeEach(() => {
    rmSync(limitsDir, { recursive: true, force: true })
    writeConfig('test-key')
    fakeStatus = 200
    fakeCalls = 0
  })

  test('só aceita POST', async () => {
    expect((await fetch(url)).status).toBe(405)
  })

  test('não libera o formulário para outros sites (sem CORS aberto)', async () => {
    const res = await post(valid, { Origin: 'https://site-malicioso.example' })
    expect(res.status).toBe(403)
    expect(res.headers.get('access-control-allow-origin')).toBeNull()
  })

  test('aceita envio vindo do próprio site', async () => {
    const res = await post(valid, { Origin: `http://127.0.0.1:${port}` })
    expect(res.status).toBe(200)
    expect(fakeCalls).toBe(1)
  })

  test('só aceita JSON', async () => {
    const res = await fetch(url, { method: 'POST', body: 'name=x', headers: { 'Content-Type': 'text/plain' } })
    expect(res.status).toBe(415)
  })

  test('recusa corpo grande demais', async () => {
    expect((await post({ ...valid, message: 'a'.repeat(25000) })).status).toBe(413)
  })

  test('robô que preenche o campo escondido recebe "ok" e nada é enviado', async () => {
    const res = await post({ ...valid, website: 'https://spam.example' })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(fakeCalls).toBe(0)
  })

  test('recusa nome com quebra de linha', async () => {
    expect((await post({ ...valid, name: 'Maria\nBcc: x@example.com' })).status).toBe(400)
  })

  test('sem a chave da Resend responde 503 CHAVE_RESEND_AUSENTE', async () => {
    writeConfig('')
    const res = await post(valid)
    expect(res.status).toBe(503)
    expect(await res.json()).toMatchObject({ codigo: 'CHAVE_RESEND_AUSENTE' })
  })

  test('Resend recusou: 502 com o status dela no código', async () => {
    fakeStatus = 403
    const res = await post(valid)
    expect(res.status).toBe(502)
    expect(await res.json()).toMatchObject({ codigo: 'RESEND_RECUSOU_403' })
  })

  test('envios que falharam não gastam o limite (revisão da PR #16)', async () => {
    writeConfig('')
    for (let i = 0; i < 6; i++) {
      expect((await post(valid)).status).toBe(503)
    }
    writeConfig('test-key')
    expect((await post(valid)).status).toBe(200)
  })

  test('limita a 5 envios por hora e não guarda o IP em texto', async () => {
    for (let i = 0; i < 5; i++) {
      expect((await post(valid)).status).toBe(200)
    }
    const blocked = await post(valid)
    expect(blocked.status).toBe(429)
    const { error, codigo } = (await blocked.json()) as { error: string; codigo: string }
    expect(codigo).toBe('LIMITE_DE_ENVIOS')
    expect(error).toContain('muitas mensagens')
    expect(fakeCalls).toBe(5)

    for (const file of readdirSync(limitsDir)) {
      expect(file).not.toContain('127.0.0.1')
      expect(readFileSync(join(limitsDir, file), 'utf8')).not.toContain('127.0.0.1')
    }
  })
})
