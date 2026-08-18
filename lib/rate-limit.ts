// Very small in-memory rate limiter. On serverless (Vercel) each cold instance
// starts with a fresh Map, so this offers per-instance protection rather than
// a global guarantee. Good enough for a single-owner admin login endpoint.

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

// Periodic cleanup so the Map doesn't grow forever
let lastCleanup = 0
function cleanup(now: number) {
  if (now - lastCleanup < 60_000) return
  lastCleanup = now
  for (const [key, b] of buckets) if (b.resetAt < now) buckets.delete(key)
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now()
  cleanup(now)
  const b = buckets.get(key)
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs }
  }
  b.count += 1
  const allowed = b.count <= limit
  return { allowed, remaining: Math.max(0, limit - b.count), resetAt: b.resetAt }
}
