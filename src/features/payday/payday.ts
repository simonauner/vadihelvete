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

const COMMENTS = {
  today: [
    'Lönen kommer idag för i helvete! Betala räkningarna först.',
    'Idag för i helvete! Hyran först, sen bärs.',
    'Lönedag! Försök att inte spendera allt innan lunch.',
    'Pengarna är här. Låtsas att du är vuxen för en gångs skull.',
  ],
  justPaid: [
    (ago: string) => `Lönen kom för ${ago} sen. Vart i helvete tog den vägen?`,
    (ago: string) => `Lönen kom för ${ago} sen. Kolla saldot, om du vågar.`,
    (ago: string) =>
      `Det var ${ago} sen lönen. Varför i helvete är kontot redan tomt?`,
    (ago: string) =>
      `Lönen kom för ${ago} sen. Lägg ifrån dig kortet för i helvete.`,
  ],
  tomorrow: [
    'Imorgon. Lägg ner kortet en dag till.',
    'Imorgon för i helvete. Ät det som finns i frysen.',
    'En natt kvar. Sov på det innan du köper nåt.',
    'Imorgon. Varukorgen klarar sig ett dygn till.',
  ],
  soon: [
    'Snart. Håll ut för i helvete.',
    'Nästan där. Pasta och ketchup är också mat.',
    'Snart. Låtsas att Swish inte finns.',
    'Några dagar kvar. Skramla ihop panten för i helvete.',
  ],
  midMonth: [
    'Sluta handla på Zalando för i helvete.',
    'Lägg tillbaka varukorgen för i helvete.',
    'Du behöver inte en till jacka. Skärp dig för i helvete.',
    'Avbeställ Foodora för i helvete. Det finns ris hemma.',
    'Nej, det är inte en investering. Stäng fliken för i helvete.',
  ],
  farOff: [
    'Det är en bit kvar. Matlåda resten av månaden.',
    'En bit kvar. Ta med kaffe hemifrån för i helvete.',
    'Halvvägs, typ. Börja älska havregryn.',
    'Det är en bit kvar. Säg nej till afterworken för i helvete.',
  ],
  ages: [
    'Det är jävligt långt kvar. Lev på nudlar.',
    'Lönen är en avlägsen dröm. Börja odla potatis.',
    'Jävligt långt kvar. Hälsa på mamma, hon har mat.',
    'Det är så långt kvar att du lika gärna kan sluta kolla för i helvete.',
  ],
};

/** Same pick all day, so the comment doesn't change on every reload. */
const pickForDay = <T>(
  options: readonly T[],
  { year, month, day }: CalendarDate
) => {
  let hash = year * 10000 + month * 100 + day;
  hash = Math.imul(hash ^ (hash >>> 16), 0x45d9f3b);
  hash = Math.imul(hash ^ (hash >>> 16), 0x45d9f3b);
  hash ^= hash >>> 16;
  return options[(hash >>> 0) % options.length];
};

export const paydayComment = (
  { daysUntil, daysSince }: PaydayStatus,
  today: CalendarDate
) => {
  if (daysUntil === 0) return pickForDay(COMMENTS.today, today);
  if (daysSince <= 3)
    return pickForDay(
      COMMENTS.justPaid,
      today
    )(daysSince === 1 ? 'en dag' : `${daysSince} dagar`);
  if (daysUntil === 1) return pickForDay(COMMENTS.tomorrow, today);
  if (daysUntil <= 5) return pickForDay(COMMENTS.soon, today);
  if (daysUntil <= 12) return pickForDay(COMMENTS.midMonth, today);
  if (daysUntil <= 20) return pickForDay(COMMENTS.farOff, today);
  return pickForDay(COMMENTS.ages, today);
};
