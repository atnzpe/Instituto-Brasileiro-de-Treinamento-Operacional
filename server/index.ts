import { nav, getPageContent, type PageSlug } from '../shared/content'
import { getOrSetCache } from './cache'

const PAGE_SLUGS: PageSlug[] = [
  'home',
  'quem-somos',
  'areas-de-atuacao',
  'contato',
  'rede-nacional',
  'cursos',
]
const CACHE_TTL_SECONDS = 60
const PORT = Number(process.env.PORT ?? 3001)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// QA_REPORT.html BUG-009: contact page had no form / no way to actually reach
// the institute. In production public/mensagem.php sends it with PHP mail()
// on HostGator (issue #28); this dev-only API has no mail server, so it just
// prints the e-mail it would send in this terminal.
// The institute's official contact inbox; override with CONTACT_TO_EMAIL.
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'comando.ibto@gmail.com'
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? 'comando.ibto@gmail.com'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface ContactPayload {
  name: string
  email: string
  message: string
}

function validateContactPayload(body: unknown): ContactPayload | null {
  if (typeof body !== 'object' || body === null) return null
  const { name, email, message } = body as Record<string, unknown>
  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return null
  }
  const trimmedName = name.trim()
  const trimmedEmail = email.trim()
  const trimmedMessage = message.trim()
  // The name goes into the e-mail subject: no line breaks or control chars.
  const hasControlChar = [...trimmedName].some((char) => {
    const code = char.charCodeAt(0)
    return code < 0x20 || code === 0x7f
  })
  if (!trimmedName || trimmedName.length > 200 || hasControlChar) return null
  if (!EMAIL_RE.test(trimmedEmail) || trimmedEmail.length > 320) return null
  if (!trimmedMessage || trimmedMessage.length > 5000) return null
  return { name: trimmedName, email: trimmedEmail, message: trimmedMessage }
}

function logContactEmail(payload: ContactPayload) {
  console.log(
    [
      '/api/contact — e-mail que seria enviado (desenvolvimento, nada sai desta máquina):',
      `  De: IBTO — Ouvidoria <${CONTACT_FROM_EMAIL}>`,
      `  Para: ${CONTACT_TO_EMAIL}`,
      `  Responder para: ${payload.email}`,
      `  Assunto: Nova mensagem de contato — ${payload.name}`,
      '',
      payload.message,
    ].join('\n'),
  )
}

// QA_REPORT.html BUG-010: no security headers on responses.
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
}

function json(body: unknown, init?: ResponseInit) {
  return Response.json(body, {
    ...init,
    headers: { ...corsHeaders, ...securityHeaders, ...init?.headers },
  })
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url)

    if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

    if (url.pathname === '/api/nav') {
      const data = await getOrSetCache('content:nav', CACHE_TTL_SECONDS, () => nav)
      return json(data)
    }

    const match = url.pathname.match(/^\/api\/content\/(.+)$/)
    if (match) {
      const slug = match[1] as PageSlug
      if (!PAGE_SLUGS.includes(slug)) {
        return json({ error: `Unknown page slug: ${slug}` }, { status: 404 })
      }
      const data = await getOrSetCache(`content:${slug}`, CACHE_TTL_SECONDS, () =>
        getPageContent(slug),
      )
      return json(data)
    }

    if (url.pathname === '/api/contact' && req.method === 'POST') {
      const body: unknown = await req.json().catch(() => null)
      // Honeypot filled in: a bot. Pretend it worked, send nothing (same as mensagem.php).
      const website = (body as { website?: unknown } | null)?.website
      if (typeof website === 'string' && website.trim() !== '') {
        return json({ ok: true })
      }
      const payload = validateContactPayload(body)
      if (!payload) {
        return json(
          { error: 'Dados inválidos. Preencha nome, e-mail e mensagem.', codigo: 'DADOS_INVALIDOS' },
          { status: 400 },
        )
      }
      logContactEmail(payload)
      return json({ ok: true })
    }

    return json({ error: 'Not found' }, { status: 404 })
  },
})

console.log(`IBTO content API (Redis-cached) listening on http://localhost:${PORT}`)
