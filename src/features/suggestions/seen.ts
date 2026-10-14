import { cookies } from 'next/headers';
import { parseSeen } from './suggestions';
import type { SeenSuggestions } from './types';

const COOKIE_NAME = 'seen';
const MAX_AGE_SECONDS = 30 * 60;

export const getSeen = async (): Promise<SeenSuggestions> => {
  const cookieStore = await cookies();

  return parseSeen(cookieStore.get(COOKIE_NAME)?.value);
};

export const setSeen = async (seen: SeenSuggestions): Promise<void> => {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, JSON.stringify(seen), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE_SECONDS,
    path: '/',
  });
};
