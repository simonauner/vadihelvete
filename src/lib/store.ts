import { redis } from './redis';

type MemoryEntry = { value: string; expiresAt: number };

// Kept on globalThis so dev hot reloads do not wipe it.
const memory: Map<string, MemoryEntry> = ((
  globalThis as { __vadihelveteStore?: Map<string, MemoryEntry> }
).__vadihelveteStore ??= new Map());

export class StoreNotConfiguredError extends Error {
  constructor() {
    super('Upstash Redis is not configured (KV_REST_API_URL/TOKEN)');
  }
}

// Production must use Redis: serverless instances do not share memory.
const assertMemoryAllowed = () => {
  if (process.env.NODE_ENV === 'production') {
    throw new StoreNotConfiguredError();
  }
};

export const isStoreConfigured = () =>
  Boolean(redis) || process.env.NODE_ENV !== 'production';

export const readJson = async <T>(key: string): Promise<T | null> => {
  if (redis) return (await redis.get<T>(key)) ?? null;

  assertMemoryAllowed();
  const entry = memory.get(key);
  if (!entry || entry.expiresAt < Date.now()) return null;
  return JSON.parse(entry.value) as T;
};

export const writeJson = async <T>(
  key: string,
  value: T,
  ttlSeconds: number
): Promise<void> => {
  if (redis) {
    await redis.set(key, value, { ex: ttlSeconds });
    return;
  }

  assertMemoryAllowed();
  memory.set(key, {
    value: JSON.stringify(value),
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
};

const ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789';

/** Unguessable, URL-friendly id. The link is the only access control. */
export const newId = (length = 10) => {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
};

export const isId = (value: string) => /^[a-z2-9]{6,16}$/.test(value);

/** Split a textarea into trimmed, unique, non-empty lines. */
export const parseLines = (
  value: FormDataEntryValue | null,
  { max, maxLength }: { max: number; maxLength: number }
) =>
  [
    ...new Set(
      String(value ?? '')
        .split(/\r?\n|,/)
        .map((line) => line.trim().slice(0, maxLength))
        .filter(Boolean)
    ),
  ].slice(0, max);

export const parseText = (
  value: FormDataEntryValue | null,
  maxLength: number
) =>
  String(value ?? '')
    .trim()
    .slice(0, maxLength);
