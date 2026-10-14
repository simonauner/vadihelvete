import { cookies } from 'next/headers';
import { newId } from '@/lib/store';

const COOKIE_NAME = 'voter';

export const getVoterId = async () => (await cookies()).get(COOKIE_NAME)?.value;

/** Only callable from server actions, where cookies can be set. */
export const ensureVoterId = async () => {
  const existing = await getVoterId();
  if (existing) return existing;

  const id = newId(12);
  (await cookies()).set(COOKIE_NAME, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 365 * 24 * 60 * 60,
    path: '/',
  });
  return id;
};
