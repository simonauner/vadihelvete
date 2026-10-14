import type { Clock } from '@/features/today/calendar';

const FRIDAY = 5;
const BEER_TIME = 17 * 3600;
const SNEAK_OUT = 15 * 3600;

export type FridayStatus = {
  isFriday: boolean;
  line: string;
  /** Seconds until Friday 17:00, when it is still ahead this week. */
  secondsToBeer?: number;
};

const lines: Record<number, string> = {
  0: 'Det är söndag, och imorgon är det måndag. Förlåt.',
  1: 'Det är för i helvete måndag. Fyra dagar kvar.',
  2: 'Det är tisdag. Tre dagar kvar. Bit ihop.',
  3: 'Det är onsdag. Halvvägs, för i helvete.',
  4: 'Det är torsdag. Nästan. Ärtsoppa ikväll.',
  6: 'Det är lördag. Det är ju bättre än fredag, sluta klaga.',
};

export const fridayStatus = ({
  weekday,
  secondsOfDay,
}: Clock): FridayStatus => {
  const daysToFriday = FRIDAY - weekday;
  const secondsToBeer = daysToFriday * 86_400 + BEER_TIME - secondsOfDay;
  const countdown =
    weekday >= 1 && weekday <= FRIDAY && secondsToBeer > 0
      ? secondsToBeer
      : undefined;

  if (weekday !== FRIDAY) {
    return { isFriday: false, line: lines[weekday], secondsToBeer: countdown };
  }

  if (secondsOfDay >= BEER_TIME) {
    return {
      isFriday: true,
      line: 'Det är fredag och det är helg. Gå hem för i helvete!',
    };
  }

  return {
    isFriday: true,
    line:
      secondsOfDay >= SNEAK_OUT
        ? 'Det är fredag. Smit hem för i helvete, ingen märker något.'
        : 'Det är fredag för i helvete! Men du måste jobba till fem.',
    secondsToBeer: countdown,
  };
};

export const formatCountdown = (seconds: number) => {
  const days = Math.floor(seconds / 86_400);
  const rest = seconds % 86_400;
  const clock = [
    Math.floor(rest / 3600),
    Math.floor((rest % 3600) / 60),
    rest % 60,
  ]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');

  return days > 0 ? `${days} ${days === 1 ? 'dag' : 'dagar'} ${clock}` : clock;
};
