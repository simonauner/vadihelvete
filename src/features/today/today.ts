import {
  addDays,
  type CalendarDate,
  weekdayName,
  type Weekday,
} from './calendar';
import { fetchSwedishDay } from './swedishDay';
import { nextThemeDay, themeDaysOn } from './themeDays';

const weekdayLines: Record<Weekday, string> = {
  måndag: 'Det är måndag. Kaffe för i helvete.',
  tisdag: 'Det är tisdag. Ingen bryr sig om tisdagar.',
  onsdag: 'Det är onsdag. Lillördag för i helvete.',
  torsdag: 'Det är torsdag. Ärtsoppa och pannkakor för i helvete.',
  fredag: 'Det är fredag för i helvete!',
  lördag: 'Det är lördag. Gör inget vettigt idag.',
  söndag: 'Det är söndag. Ångesten kommer ikväll.',
};

const listNames = (names: string[]) =>
  names.length <= 1
    ? (names[0] ?? '')
    : `${names.slice(0, -1).join(', ')} och ${names.at(-1)}`;

export const formatDate = (date: CalendarDate) =>
  new Intl.DateTimeFormat('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(date.year, date.month - 1, date.day)));

export const describeDay = async (date: CalendarDate) => {
  const themeDays = themeDaysOn(date);
  const swedishDay = await fetchSwedishDay(date);
  const next = nextThemeDay(date);
  const lines: string[] = [];

  if (swedishDay?.holiday) {
    lines.push(
      swedishDay.redDay
        ? `Det är ${swedishDay.holiday}. Röd dag, så ligg still för i helvete.`
        : `Det är ${swedishDay.holiday} för i helvete.`
    );
  }
  if (swedishDay?.holidayEve) {
    lines.push(`Det är ${swedishDay.holidayEve}. Förbered dig för i helvete.`);
  }
  if (swedishDay?.flagDay) {
    lines.push(`Flagga för i helvete! ${swedishDay.flagDay}.`);
  }
  if (swedishDay?.nameDays.length) {
    lines.push(
      `Grattis för i helvete till alla som heter ${listNames(swedishDay.nameDays)}.`
    );
  } else if (swedishDay) {
    lines.push('Ingen har namnsdag idag. Synd för er.');
  }

  lines.push(weekdayLines[weekdayName(date)]);

  if (next) {
    const nextNames = next.days.map((d) => `${d.name} ${d.emoji}`);
    lines.push(
      next.inDays === 1
        ? `Imorgon är det ${listNames(nextNames)}. Förbered dig.`
        : `Nästa temadag är ${listNames(nextNames)}, ${formatDate(next.date)}. Om ${next.inDays} jävla dagar.`
    );
  }

  return {
    themeDays,
    week: swedishDay?.week,
    lines,
    tomorrow: addDays(date, 1),
  };
};
