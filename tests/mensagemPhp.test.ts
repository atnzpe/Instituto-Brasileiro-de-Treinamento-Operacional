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

// With MAIL_CAPTURE_FILE set, mensagem.php writes each e-mail to this file
// (one JSON per line) instead of calling mail(), so nothing leaves the machine.
const mailFile = join(workDir, 'mails.jsonl')
// A path that can't be written: stands in for mail() returning false.
const brokenMailFile = join(workDir, 'no-such-folder', 'mails.jsonl')

interface CapturedMail {
  to: string
  subject: string
  message: string
  headers: Record<string, string>
  from: string
}

function sentMails(): CapturedMail[] {
  if (!existsSync(mailFile)) return []
  return readFileSync(mailFile, 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line) as CapturedMail)
}

/** Reverses PHP's mb_encode_mimeheader (=?UTF-8?B?…?= words). */
function decodeHeader(value: string) {
  // Whitespace between two encoded words is folding, not text (RFC 2047).
  return value
    .replace(/\?=\s+=\?/g, '?==?')
    .replace(/=\?UTF-8\?B\?([^?]*)\?=/g, (_, b64: string) => Buffer.from(b64, 'base64').toString('utf8'))
}

// mensagem.php reads config.php on every request, so tests can swap it.
function writeConfig(captureFile = mailFile) {
  writeFileSync(
    join(workDir, 'config.php'),
    [
      '<?php',
      `define('MAIL_CAPTURE_FILE', ${JSON.stringify(captureFile)});`,
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
    writeConfig()
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
    rmSync(workDir, { recursive: true, force: true })
  })

  beforeEach(() => {
    rmSync(limitsDir, { recursive: true, force: true })
    rmSync(mailFile, { force: true })
    writeConfig()
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
    expect(sentMails()).toHaveLength(1)
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
    expect(sentMails()).toHaveLength(0)
  })

  test('recusa nome com quebra de linha', async () => {
    expect((await post({ ...valid, name: 'Maria\nBcc: x@example.com' })).status).toBe(400)
  })

  test('monta o e-mail: remetente do domínio, resposta para o visitante, sem X-Mailer', async () => {
    const message = 'Preço & horário do curso?\nLinha 2 com acentuação.'
    expect((await post({ ...valid, name: 'João Conceição', message })).status).toBe(200)
    const [mail] = sentMails()
    expect(mail.to).toBe('comando.ibto@gmail.com')
    expect(mail.from).toBe('ouvidoria@ib-to.org')
    expect(mail.headers['Reply-To']).toBe(valid.email)
    expect(decodeHeader(mail.headers.From)).toBe('IBTO — Ouvidoria <ouvidoria@ib-to.org>')
    expect(Object.keys(mail.headers)).not.toContain('X-Mailer')
    expect(decodeHeader(mail.subject)).toBe('Nova mensagem de contato — João Conceição')
    // Plain text: "&" stays "&" (no htmlspecialchars), lines end in CRLF.
    const text = Buffer.from(mail.message, 'base64').toString('utf8')
    expect(text).toContain('Nome: João Conceição\r\n')
    expect(text).toContain('Preço & horário do curso?\r\nLinha 2 com acentuação.')
  })

  test('nenhum cabeçalho do e-mail tem quebra de linha', async () => {
    expect((await post(valid)).status).toBe(200)
    const [mail] = sentMails()
    for (const value of [mail.subject, ...Object.values(mail.headers)]) {
      expect(value).not.toMatch(/[\r\n]/)
    }
  })

  test('servidor de e-mail recusou: 502 EMAIL_NAO_ENVIADO', async () => {
    writeConfig(brokenMailFile)
    const res = await post(valid)
    expect(res.status).toBe(502)
    expect(await res.json()).toMatchObject({ codigo: 'EMAIL_NAO_ENVIADO' })
  })

  test('envios que falharam não gastam o limite (revisão da PR #16)', async () => {
    writeConfig(brokenMailFile)
    for (let i = 0; i < 6; i++) {
      expect((await post(valid)).status).toBe(502)
    }
    writeConfig()
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
    expect(sentMails()).toHaveLength(5)

    for (const file of readdirSync(limitsDir)) {
      expect(file).not.toContain('127.0.0.1')
      expect(readFileSync(join(limitsDir, file), 'utf8')).not.toContain('127.0.0.1')
    }
  })
})
