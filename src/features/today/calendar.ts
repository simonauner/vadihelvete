export type CalendarDate = { year: number; month: number; day: number };

const WEEKDAYS = [
  'söndag',
  'måndag',
  'tisdag',
  'onsdag',
  'torsdag',
  'fredag',
  'lördag',
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

/** Today's date in Sweden, regardless of the server's time zone. */
export const stockholmDate = (now: Date = new Date()): CalendarDate => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Stockholm',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })
      .formatToParts(now)
      .map(({ type, value }) => [type, Number(value)])
  );

  return { year: parts.year, month: parts.month, day: parts.day };
};

const toUtc = ({ year, month, day }: CalendarDate) =>
  new Date(Date.UTC(year, month - 1, day));

const fromUtc = (date: Date): CalendarDate => ({
  year: date.getUTCFullYear(),
  month: date.getUTCMonth() + 1,
  day: date.getUTCDate(),
});

export const addDays = (date: CalendarDate, days: number): CalendarDate => {
  const utc = toUtc(date);
  utc.setUTCDate(utc.getUTCDate() + days);
  return fromUtc(utc);
};

/** 0 = Sunday … 6 = Saturday */
export const weekdayIndex = (date: CalendarDate) => toUtc(date).getUTCDay();

export const weekdayName = (date: CalendarDate): Weekday =>
  WEEKDAYS[weekdayIndex(date)];

export const isSameDate = (a: CalendarDate, b: CalendarDate) =>
  a.year === b.year && a.month === b.month && a.day === b.day;

export const daysInMonth = (year: number, month: number) =>
  new Date(Date.UTC(year, month, 0)).getUTCDate();

/** Easter Sunday (anonymous Gregorian algorithm). */
export const easterSunday = (year: number): CalendarDate => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return { year, month, day };
};

/** The nth (1-based) given weekday of a month. */
export const nthWeekday = (
  year: number,
  month: number,
  weekday: number,
  n: number
): CalendarDate => {
  const first = weekdayIndex({ year, month, day: 1 });
  const day = 1 + ((weekday - first + 7) % 7) + (n - 1) * 7;
  return { year, month, day };
};

export const lastWeekday = (
  year: number,
  month: number,
  weekday: number
): CalendarDate => {
  const lastDay = daysInMonth(year, month);
  const last = weekdayIndex({ year, month, day: lastDay });
  return { year, month, day: lastDay - ((last - weekday + 7) % 7) };
};

export const daysBetween = (from: CalendarDate, to: CalendarDate) =>
  Math.round((toUtc(to).getTime() - toUtc(from).getTime()) / 86_400_000);

export const compareDates = (a: CalendarDate, b: CalendarDate) =>
  daysBetween(b, a);

/** Midsommardagen: the Saturday between 20 and 26 June. */
const midsummerDay = (year: number): CalendarDate => {
  const june20: CalendarDate = { year, month: 6, day: 20 };
  return addDays(june20, (6 - weekdayIndex(june20) + 7) % 7);
};

/**
 * Days when Swedish banks are closed besides weekends: public holidays
 * plus midsommarafton, julafton and nyårsafton.
 */
export const bankHolidays = (year: number): CalendarDate[] => {
  const easter = easterSunday(year);

  return [
    { year, month: 1, day: 1 },
    { year, month: 1, day: 6 },
    addDays(easter, -2),
    addDays(easter, 1),
    { year, month: 5, day: 1 },
    addDays(easter, 39),
    { year, month: 6, day: 6 },
    addDays(midsummerDay(year), -1),
    { year, month: 12, day: 24 },
    { year, month: 12, day: 25 },
    { year, month: 12, day: 26 },
    { year, month: 12, day: 31 },
  ];
};

export const isBankDay = (date: CalendarDate) => {
  const weekday = weekdayIndex(date);
  if (weekday === 0 || weekday === 6) return false;

  return !bankHolidays(date.year).some((holiday) => isSameDate(holiday, date));
};
