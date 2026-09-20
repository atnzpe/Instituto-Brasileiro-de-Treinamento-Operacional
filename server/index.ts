import { nav, getPageContent, type PageSlug } from '../shared/content'
import { getOrSetCache } from './cache'

const PAGE_SLUGS: PageSlug[] = ['home', 'quem-somos', 'areas-de-atuacao', 'contato']
const CACHE_TTL_SECONDS = 60
const PORT = Number(process.env.PORT ?? 3001)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

function json(body: unknown, init?: ResponseInit) {
  return Response.json(body, {
    ...init,
    headers: { ...corsHeaders, ...init?.headers },
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

    return json({ error: 'Not found' }, { status: 404 })
  },
})

console.log(`IBTO content API (Redis-cached) listening on http://localhost:${PORT}`)
