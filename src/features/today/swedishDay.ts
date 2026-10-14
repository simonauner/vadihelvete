import type { CalendarDate } from './calendar';

export type SwedishDay = {
  week: number;
  holiday?: string;
  holidayEve?: string;
  redDay: boolean;
  nameDays: string[];
  flagDay?: string;
};

const pad = (n: number) => String(n).padStart(2, '0');

export const parseSwedishDay = (json: unknown): SwedishDay | null => {
  const day = (json as { dagar?: Record<string, unknown>[] })?.dagar?.[0];
  if (!day) return null;

  const text = (key: string) =>
    typeof day[key] === 'string' && day[key] ? (day[key] as string) : undefined;

  return {
    week: Number(day.vecka) || 0,
    holiday: text('helgdag'),
    holidayEve: text('helgdagsafton'),
    redDay: day['röd dag'] === 'Ja',
    nameDays: Array.isArray(day.namnsdag)
      ? day.namnsdag.filter((name): name is string => typeof name === 'string')
      : [],
    flagDay: text('flaggdag'),
  };
};

/**
 * Name days, holidays and flag days from the free sholiday API
 * (https://sholiday.faboul.se). Cached for a day; null if it is down.
 */
export const fetchSwedishDay = async ({
  year,
  month,
  day,
}: CalendarDate): Promise<SwedishDay | null> => {
  try {
    const response = await fetch(
      `https://sholiday.faboul.se/dagar/v2.1/${year}/${pad(month)}/${pad(day)}`,
      { next: { revalidate: 86400 } }
    );
    if (!response.ok) return null;

    return parseSwedishDay(await response.json());
  } catch (error) {
    console.error('sholiday failed', error);
    return null;
  }
};
