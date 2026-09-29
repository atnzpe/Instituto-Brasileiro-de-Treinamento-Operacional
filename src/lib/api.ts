import type { PageSlug } from '../../shared/content'

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Request to ${path} failed with ${res.status}`)
  return res.json() as Promise<T>
}

export function fetchNav() {
  return getJson<import('../../shared/content').NavLink[]>('/api/nav')
}

export function fetchPageContent<T>(slug: PageSlug) {
  return getJson<T>(`/api/content/${slug}`)
}

export interface ContactPayload {
  name: string
  email: string
  message: string
  /** Honeypot: hidden from people, so it only comes filled in from bots. */
  website?: string
}

// Overridable at build time (VITE_CONTACT_ENDPOINT) so a static deploy with
// no Bun API (e.g. HostGator shared hosting) can point this at mensagem.php
// instead of the dev-only /api/contact proxied to server/index.ts.
const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT ?? '/api/contact'

const CONTACT_TIMEOUT_MS = 20000
const CONNECTION_ERROR =
  'Não foi possível conectar ao servidor. Verifique sua internet e tente de novo, ou fale conosco pelo WhatsApp.'
const SEND_ERROR =
  'Não foi possível enviar sua mensagem agora. Tente novamente mais tarde ou fale conosco pelo WhatsApp.'

/** Appends the error code (e.g. EMAIL_NAO_ENVIADO) shown to whoever tests. */
export function withCode(message: string, code: string) {
  return `${message} (código: ${code})`
}

export async function submitContact(payload: ContactPayload) {
  // AbortController + setTimeout instead of AbortSignal.timeout(), which
  // Safari only has from version 16: there it threw before the request left.
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), CONTACT_TIMEOUT_MS)
  let res: Response
  try {
    res = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
  } catch {
    clearTimeout(timer)
    // Offline, timed out or blocked on the way: the browser only says
    // "Failed to fetch", which means nothing to a visitor.
    throw new Error(withCode(CONNECTION_ERROR, 'SEM_CONEXAO'))
  }
  clearTimeout(timer)
  const data: { error?: string; codigo?: string } = await res.json().catch(() => ({}))
  // No JSON error means the answer didn't come from mensagem.php (e.g. the
  // hosting firewall): show a message a visitor can act on. The code tells
  // whoever tests exactly which check failed.
  if (!res.ok) throw new Error(withCode(data.error ?? SEND_ERROR, data.codigo ?? `HTTP_${res.status}`))
  return data
}
