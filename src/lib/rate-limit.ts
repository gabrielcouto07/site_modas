import { LRUCache } from "lru-cache";

type Entry = {
  count: number;
  resetAt: number;
};

const cache = new LRUCache<string, Entry>({
  max: 500,
  ttl: 1000 * 60 * 60,
});

export function rateLimitByIp(key: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const current = cache.get(key);

  if (!current || current.resetAt < now) {
    cache.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { success: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return { success: false, remaining: 0 };
  }

  current.count += 1;
  cache.set(key, current);
  return { success: true, remaining: limit - current.count };
}
