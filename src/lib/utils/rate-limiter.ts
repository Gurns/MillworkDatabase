const store = new Map<string, number[]>();

const CLEANUP_INTERVAL = 60_000;

setInterval(() => {
  const now = Date.now();
  const entries = Array.from(store.entries());
  for (const [key, timestamps] of entries) {
    const filtered = timestamps.filter((t: number) => now - t < 60_000);
    if (filtered.length === 0) {
      store.delete(key);
    } else {
      store.set(key, filtered);
    }
  }
}, CLEANUP_INTERVAL);

export interface RateLimitOptions {
  maxRequests?: number;
  windowMs?: number;
}

export function createRateLimiter({
  maxRequests = 10,
  windowMs = 60_000,
}: RateLimitOptions = {}) {
  return function rateLimit(key: string) {
    const now = Date.now();
    const timestamps = store.get(key) || [];
    const filtered = timestamps.filter((t: number) => now - t < windowMs);

    if (filtered.length >= maxRequests) {
      const retryAfter = Math.ceil((filtered[0] + windowMs - now) / 1000);
      store.set(key, filtered);
      return { allowed: false, retryAfter };
    }

    filtered.push(now);
    store.set(key, filtered);
    return { allowed: true, remaining: maxRequests - filtered.length };
  };
}

export function getRateLimitKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  return ip;
}

export const authRateLimiter = createRateLimiter({ maxRequests: 5, windowMs: 60_000 });
export const apiRateLimiter = createRateLimiter({ maxRequests: 30, windowMs: 60_000 });
export const searchRateLimiter = createRateLimiter({ maxRequests: 20, windowMs: 60_000 });
