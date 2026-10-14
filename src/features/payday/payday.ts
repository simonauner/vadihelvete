import {
  addDays,
  compareDates,
  daysBetween,
  daysInMonth,
  isBankDay,
  type CalendarDate,
} from '@/features/today/calendar';

export const DEFAULT_PAYDAY = 25;

/** Payday in a month: the given day, or the closest bank day before it. */
export const paydayIn = (
  year: number,
  month: number,
  dayOfMonth = DEFAULT_PAYDAY
): CalendarDate => {
  let date: CalendarDate = {
    year,
    month,
    day: Math.min(dayOfMonth, daysInMonth(year, month)),
  };
  while (!isBankDay(date)) date = addDays(date, -1);
  return date;
};

const shiftMonth = ({ year, month }: CalendarDate, by: number) => {
  const index = year * 12 + (month - 1) + by;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
};

export type PaydayStatus = {
  next: CalendarDate;
  daysUntil: number;
  previous: CalendarDate;
  daysSince: number;
};

export const paydayStatus = (
  today: CalendarDate,
  dayOfMonth = DEFAULT_PAYDAY
): PaydayStatus => {
  const thisMonth = paydayIn(today.year, today.month, dayOfMonth);
  const nextMonth = shiftMonth(today, 1);
  const lastMonth = shiftMonth(today, -1);

  const next =
    compareDates(thisMonth, today) >= 0
      ? thisMonth
      : paydayIn(nextMonth.year, nextMonth.month, dayOfMonth);
  const previous =
    compareDates(thisMonth, today) <= 0
      ? thisMonth
      : paydayIn(lastMonth.year, lastMonth.month, dayOfMonth);

  return {
    next,
    daysUntil: daysBetween(today, next),
    previous,
    daysSince: daysBetween(previous, today),
  };
};

export const paydayComment = ({ daysUntil, daysSince }: PaydayStatus) => {
  if (daysUntil === 0)
    return 'Lönen kommer idag för i helvete! Betala räkningarna först.';
  if (daysSince <= 3)
    return `Lönen kom för ${daysSince === 1 ? 'en dag' : `${daysSince} dagar`} sen. Vart i helvete tog den vägen?`;
  if (daysUntil === 1) return 'Imorgon. Lägg ner kortet en dag till.';
  if (daysUntil <= 5) return 'Snart. Håll ut för i helvete.';
  if (daysUntil <= 12) return 'Sluta handla på Zalando för i helvete.';
  if (daysUntil <= 20) return 'Det är en bit kvar. Matlåda resten av månaden.';
  return 'Det är jävligt långt kvar. Lev på nudlar.';
};
