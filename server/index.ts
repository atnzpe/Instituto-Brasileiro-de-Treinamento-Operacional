import { nav, getPageContent, type PageSlug } from '../shared/content'
import { getOrSetCache } from './cache'

const PAGE_SLUGS: PageSlug[] = [
  'home',
  'quem-somos',
  'areas-de-atuacao',
  'contato',
  'rede-nacional',
]
const CACHE_TTL_SECONDS = 60
const PORT = Number(process.env.PORT ?? 3001)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// QA_REPORT.html BUG-009: contact page had no form / no way to actually reach
// the institute. Sent through Resend's HTTP API so we don't need an SMTP
// server — just an API key, no new dependency (plain fetch).
const RESEND_API_KEY = process.env.RESEND_API_KEY
// Temporary destination while the institute sets up a dedicated inbox —
// override with CONTACT_TO_EMAIL once contato@ib-to.org (or similar) exists.
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'eduars.lopes@gmail.com'
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? 'ouvidoria@ib-to.org'

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
  if (!trimmedName || trimmedName.length > 200) return null
  if (!EMAIL_RE.test(trimmedEmail) || trimmedEmail.length > 320) return null
  if (!trimmedMessage || trimmedMessage.length > 5000) return null
  return { name: trimmedName, email: trimmedEmail, message: trimmedMessage }
}

async function sendContactEmail(payload: ContactPayload) {
  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured')
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `IBTO — Ouvidoria <${CONTACT_FROM_EMAIL}>`,
      to: [CONTACT_TO_EMAIL],
      reply_to: payload.email,
      subject: `Nova mensagem de contato — ${payload.name}`,
      text: `Nome: ${payload.name}\nE-mail: ${payload.email}\n\n${payload.message}`,
    }),
  })

  if (!res.ok) {
    throw new Error(`Resend API error: ${res.status}`)
  }
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
      const payload = validateContactPayload(await req.json().catch(() => null))
      if (!payload) {
        return json({ error: 'Dados inválidos. Preencha nome, e-mail e mensagem.' }, { status: 400 })
      }
      try {
        await sendContactEmail(payload)
        return json({ ok: true })
      } catch {
        return json(
          { error: 'Não foi possível enviar sua mensagem agora. Tente novamente mais tarde.' },
          { status: 502 },
        )
      }
    }

    return json({ error: 'Not found' }, { status: 404 })
  },
})

console.log(`IBTO content API (Redis-cached) listening on http://localhost:${PORT}`)
