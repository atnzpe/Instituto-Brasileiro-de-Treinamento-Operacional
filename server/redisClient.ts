import Redis from 'ioredis'

// Points at a local/managed Redis instance in production. In this template
// no Redis server is actually running, so cache.ts falls back to calling
// the underlying fetcher whenever a command fails — this client only
// defines *where* that connection would live.
export const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  lazyConnect: true,
  retryStrategy: () => null, // never auto-retry; let cache.ts fall back instead
  reconnectOnError: () => false,
})

redis.on('error', () => {
  // Swallowed intentionally: cache.ts treats a Redis failure as a cache miss.
})
