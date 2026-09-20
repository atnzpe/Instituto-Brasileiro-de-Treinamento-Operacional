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
