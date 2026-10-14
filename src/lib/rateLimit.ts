import { Ratelimit, type Duration } from '@upstash/ratelimit';
import { headers } from 'next/headers';
import { redis } from './redis';

type Limit = { requests: number; window: Duration; windowMs: number };

const limiters = new Map<string, Ratelimit>();
const memory = new Map<string, number[]>();

const clientKey = async (): Promise<string> => {
  const headerList = await headers();

  return (
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headerList.get('x-real-ip') ??
    'anonymous'
  );
};

// Without Redis (local dev) we fall back to a per-instance sliding window.
const memoryLimit = (key: string, { requests, windowMs }: Limit): boolean => {
  const now = Date.now();
  const hits = (memory.get(key) ?? []).filter((time) => now - time < windowMs);
  if (hits.length >= requests) return false;

  memory.set(key, [...hits, now]);
  return true;
};

/** Returns true when the caller is allowed through. */
export const rateLimit = async (name: string, limit: Limit) => {
  const key = `${name}:${await clientKey()}`;

  if (!redis) return memoryLimit(key, limit);

  let limiter = limiters.get(name);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit.requests, limit.window),
      prefix: 'ratelimit',
    });
    limiters.set(name, limiter);
  }

  const { success } = await limiter.limit(key);
  return success;
};
