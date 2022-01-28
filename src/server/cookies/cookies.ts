import cookie from 'cookie';
import dayjs from 'dayjs';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import { SeenSuggestions } from '../../domain/Suggestions';
import { logger } from '../logger';

type CookieData = {
  timeStamp: Date;
  seenSuggestions: SeenSuggestions;
};

export const getResponseCookies = (
  seenSuggestions: SeenSuggestions
): string => {
  const now = new Date();

  const data: CookieData = {
    timeStamp: now,
    seenSuggestions,
  };

  return cookie.serialize('data', JSON.stringify(data), {
    secure: true,
    httpOnly: true,
  });
};

const hasSuggestionsExpired = (timeStamp: Date): boolean => {
  const now = dayjs();

  if (dayjs(timeStamp).add(30, 'minute') < now) {
    logger.debug('suggestions has expired');
    return true;
  }

  return false;
};

export const getSeenSuggestions = (
  currentCookies: NextApiRequestCookies
): SeenSuggestions => {
  if (!currentCookies?.data) return {};

  const json = JSON.parse(currentCookies?.data) as CookieData;

  if (hasSuggestionsExpired(json.timeStamp)) {
    return {};
  }

  return json?.seenSuggestions;
};
