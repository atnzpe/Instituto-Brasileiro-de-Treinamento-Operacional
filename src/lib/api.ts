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
// no Bun API (e.g. HostGator shared hosting) can point this at contact.php
// instead of the dev-only /api/contact proxied to server/index.ts.
const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT ?? '/api/contact'

export async function submitContact(payload: ContactPayload) {
  const res = await fetch(CONTACT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data: { error?: string } = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error ?? `Request failed with ${res.status}`)
  return data
}
