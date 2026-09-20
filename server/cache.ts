import { redis } from './redisClient'

/**
 * Read-through cache: serves `key` from Redis when present, otherwise runs
 * `fetcher`, stores the result with a TTL, and returns it. If Redis is
 * unreachable (no server running, network error, etc.) it degrades to
 * calling `fetcher` directly so the API never depends on Redis being up.
 */
export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => T | Promise<T>,
): Promise<T> {
  try {
    const cached = await redis.get(key)
    if (cached) return JSON.parse(cached) as T
  } catch {
    // Redis unavailable — fall through to the fetcher below.
  }

  const value = await fetcher()

  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds)
  } catch {
    // Redis unavailable — the response is still served, just uncached.
  }

  return value
}
