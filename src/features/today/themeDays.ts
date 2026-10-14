import {
  addDays,
  easterSunday,
  isSameDate,
  lastWeekday,
  nthWeekday,
  type CalendarDate,
} from './calendar';

export type ThemeDay = { name: string; emoji: string };

type FixedThemeDay = ThemeDay & { month: number; day: number };
type MovableThemeDay = ThemeDay & { date: (year: number) => CalendarDate };

const SUN = 0;
const TUE = 2;
const WED = 3;
const THU = 4;
const FRI = 5;
const SAT = 6;

// Sources: temadagar.se, cross-checked against sv.wikipedia "Temadag" where
// possible. Most food days are industry inventions, so take them lightly.
const fixed: FixedThemeDay[] = [
  { month: 1, day: 1, name: 'Pizzans dag', emoji: '🍕' },
  { month: 1, day: 12, name: 'Marsipanens dag', emoji: '🐷' },
  { month: 1, day: 14, name: 'Fullkornets dag', emoji: '🌾' },
  { month: 1, day: 17, name: 'Internationella pizzadagen', emoji: '🍕' },
  { month: 1, day: 19, name: 'Popcornets dag', emoji: '🍿' },
  { month: 1, day: 22, name: 'Vinets dag', emoji: '🍷' },
  { month: 2, day: 1, name: 'Vegetariska dagen', emoji: '🥦' },
  { month: 2, day: 2, name: 'Smoothiens dag', emoji: '🥤' },
  { month: 2, day: 3, name: 'Morotskakans dag', emoji: '🥕' },
  { month: 2, day: 8, name: 'Äggahalvans dag', emoji: '🥚' },
  { month: 2, day: 15, name: 'Geléhallonens dag', emoji: '🍬' },
  { month: 2, day: 19, name: 'Knäckebrödets dag', emoji: '🍘' },
  { month: 2, day: 25, name: 'Grapefruktens dag', emoji: '🍊' },
  { month: 2, day: 26, name: 'Husmanskostens dag', emoji: '🍲' },
  { month: 3, day: 3, name: 'Mandelkubbens dag', emoji: '🍪' },
  { month: 3, day: 4, name: 'Bananens dag', emoji: '🍌' },
  { month: 3, day: 5, name: 'Ostbågens dag', emoji: '🧀' },
  { month: 3, day: 7, name: 'Punschrullens dag', emoji: '🟢' },
  { month: 3, day: 9, name: 'Tomatsåsens dag', emoji: '🍅' },
  { month: 3, day: 12, name: 'Korvens dag', emoji: '🌭' },
  { month: 3, day: 14, name: 'Pi-dagen', emoji: '🥧' },
  { month: 3, day: 23, name: 'Matlådans dag', emoji: '🍱' },
  { month: 3, day: 24, name: 'Glassens dag', emoji: '🍨' },
  { month: 3, day: 25, name: 'Våffeldagen', emoji: '🧇' },
  { month: 4, day: 4, name: 'Morotens dag', emoji: '🥕' },
  { month: 4, day: 10, name: 'Bulle med bullens dag', emoji: '🍔' },
  { month: 4, day: 12, name: 'Lakritsens dag', emoji: '🖤' },
  { month: 4, day: 12, name: 'Linssoppans dag', emoji: '🥣' },
  { month: 4, day: 20, name: 'Polkagrisens dag', emoji: '🍭' },
  { month: 4, day: 20, name: 'Svenska gin & tonic-dagen', emoji: '🍸' },
  { month: 5, day: 1, name: 'Budapestbakelsens dag', emoji: '🍰' },
  { month: 5, day: 2, name: 'Världsdagen för tonfisk', emoji: '🐟' },
  { month: 5, day: 4, name: 'Star Wars-dagen', emoji: '🌌' },
  { month: 5, day: 11, name: 'Chokladbollens dag', emoji: '🟤' },
  { month: 5, day: 15, name: 'Kardemummabullens dag', emoji: '🥯' },
  { month: 5, day: 19, name: 'Halloumiostens dag', emoji: '🧀' },
  { month: 5, day: 21, name: 'Internationella tedagen', emoji: '🍵' },
  { month: 5, day: 25, name: 'Handduksdagen', emoji: '🧺' },
  { month: 5, day: 27, name: 'Ostens dag', emoji: '🧀' },
  { month: 6, day: 1, name: 'Mjölkens dag', emoji: '🥛' },
  { month: 6, day: 6, name: 'Sillens dag', emoji: '🐟' },
  { month: 6, day: 6, name: 'Färskpotatisens dag', emoji: '🥔' },
  { month: 6, day: 18, name: 'Sushins dag', emoji: '🍣' },
  { month: 6, day: 26, name: 'Chokladpuddingens dag', emoji: '🍮' },
  { month: 6, day: 30, name: 'Pilsnerkorvens dag', emoji: '🌭' },
  { month: 7, day: 13, name: 'Paltdagen', emoji: '🥟' },
  { month: 7, day: 23, name: 'Varmkorvens dag', emoji: '🌭' },
  { month: 7, day: 26, name: 'Bellmansdagen', emoji: '🎻' },
  { month: 7, day: 29, name: 'Lasagnens dag', emoji: '🍝' },
  { month: 8, day: 3, name: 'Vattenmelonens dag', emoji: '🍉' },
  { month: 8, day: 9, name: 'Rulltårtans dag', emoji: '🍥' },
  { month: 8, day: 20, name: 'Honungens dag', emoji: '🍯' },
  { month: 8, day: 23, name: 'Köttbullens dag', emoji: '🧆' },
  { month: 9, day: 2, name: 'Kokosnötens dag', emoji: '🥥' },
  { month: 9, day: 11, name: 'Kebabens dag', emoji: '🥙' },
  { month: 9, day: 18, name: 'Surkålens dag', emoji: '🥬' },
  { month: 9, day: 19, name: 'Messmörets dag', emoji: '🧈' },
  { month: 9, day: 25, name: 'Äpplets dag', emoji: '🍎' },
  { month: 9, day: 29, name: 'Kaffets dag', emoji: '☕' },
  { month: 10, day: 1, name: 'Internationella kaffedagen', emoji: '☕' },
  { month: 10, day: 4, name: 'Kanelbullens dag', emoji: '🥐' },
  { month: 10, day: 4, name: 'Tacons dag', emoji: '🌮' },
  { month: 10, day: 10, name: 'Grötens dag', emoji: '🥣' },
  { month: 10, day: 11, name: 'Äppelmustens dag', emoji: '🧃' },
  { month: 10, day: 14, name: 'Räkmackans dag', emoji: '🦐' },
  { month: 10, day: 15, name: 'Fetaostens dag', emoji: '🧀' },
  { month: 10, day: 19, name: 'Sjömatens dag', emoji: '🦞' },
  { month: 10, day: 25, name: 'Världspastadagen', emoji: '🍝' },
  { month: 10, day: 26, name: 'Potatisens dag', emoji: '🥔' },
  { month: 10, day: 31, name: 'Halloween', emoji: '🎃' },
  { month: 11, day: 7, name: 'Kladdkakans dag', emoji: '🍫' },
  { month: 11, day: 10, name: 'Mårtensafton', emoji: '🪿' },
  { month: 11, day: 11, name: 'Chokladens dag', emoji: '🍫' },
  { month: 11, day: 13, name: 'Smörgåstårtans dag', emoji: '🥪' },
  { month: 11, day: 14, name: 'Ostkakans dag', emoji: '🍰' },
  { month: 11, day: 17, name: 'Napoleonbakelsens dag', emoji: '🍰' },
  { month: 11, day: 22, name: 'Wienerbrödets dag', emoji: '🥐' },
  { month: 11, day: 24, name: 'Julmustens dag', emoji: '🥤' },
  { month: 11, day: 30, name: 'Kåldolmens dag', emoji: '🥬' },
  { month: 12, day: 1, name: 'Glöggens dag', emoji: '🍷' },
  { month: 12, day: 9, name: 'Pepparkakans dag', emoji: '🍪' },
  { month: 12, day: 13, name: 'Lucia', emoji: '🕯️' },
  { month: 12, day: 21, name: 'Skumtomtens dag', emoji: '🎅' },
];

const movable: MovableThemeDay[] = [
  {
    name: 'Fettisdagen',
    emoji: '🧁',
    date: (year) => addDays(easterSunday(year), -47),
  },
  { name: 'Surdegsdagen', emoji: '🍞', date: (y) => nthWeekday(y, 4, SAT, 2) },
  {
    name: 'Syltkakans dag',
    emoji: '🍪',
    date: (y) => nthWeekday(y, 5, WED, 2),
  },
  {
    name: 'Tunnbrödets dag',
    emoji: '🫓',
    date: (y) => nthWeekday(y, 5, SAT, 2),
  },
  { name: 'Mors dag', emoji: '💐', date: (y) => lastWeekday(y, 5, SUN) },
  { name: 'Donutens dag', emoji: '🍩', date: (y) => nthWeekday(y, 6, FRI, 1) },
  { name: 'Ölets dag', emoji: '🍺', date: (y) => nthWeekday(y, 7, WED, 3) },
  { name: 'Räkans dag', emoji: '🦐', date: (y) => nthWeekday(y, 7, SAT, 3) },
  {
    name: 'Internationella glassdagen',
    emoji: '🍦',
    date: (y) => nthWeekday(y, 7, SUN, 3),
  },
  {
    name: 'Internationella öldagen',
    emoji: '🍻',
    date: (y) => nthWeekday(y, 8, FRI, 1),
  },
  {
    name: 'Surströmmingspremiären',
    emoji: '🐟',
    date: (y) => nthWeekday(y, 8, THU, 3),
  },
  { name: 'Svampens dag', emoji: '🍄', date: (y) => nthWeekday(y, 9, SUN, 1) },
  { name: 'Lösgodisets dag', emoji: '🍬', date: (y) => lastWeekday(y, 9, SAT) },
  {
    name: 'Gräddtårtans dag',
    emoji: '🎂',
    date: (y) => nthWeekday(y, 10, SUN, 1),
  },
  { name: 'Äggets dag', emoji: '🥚', date: (y) => nthWeekday(y, 10, FRI, 2) },
  {
    name: 'Grynkorvens dag',
    emoji: '🌭',
    date: (y) => nthWeekday(y, 10, THU, 3),
  },
  {
    name: 'Champagnens dag',
    emoji: '🍾',
    date: (y) => nthWeekday(y, 10, FRI, 4),
  },
  {
    name: 'Hackkorvens dag',
    emoji: '🌭',
    date: (y) => nthWeekday(y, 10, SAT, 4),
  },
  { name: 'Fars dag', emoji: '👔', date: (y) => nthWeekday(y, 11, SUN, 2) },
  {
    name: 'Raggmunkens dag',
    emoji: '🥔',
    date: (y) => nthWeekday(y, 11, TUE, 3),
  },
];

export const themeDaysOn = (date: CalendarDate): ThemeDay[] => [
  ...fixed
    .filter((day) => day.month === date.month && day.day === date.day)
    .map(({ name, emoji }) => ({ name, emoji })),
  ...movable
    .filter((day) => isSameDate(day.date(date.year), date))
    .map(({ name, emoji }) => ({ name, emoji })),
];

/** The next date (after `from`) that has at least one theme day. */
export const nextThemeDay = (
  from: CalendarDate
): { date: CalendarDate; inDays: number; days: ThemeDay[] } | null => {
  for (let inDays = 1; inDays <= 366; inDays++) {
    const date = addDays(from, inDays);
    const days = themeDaysOn(date);
    if (days.length) return { date, inDays, days };
  }

  return null;
};
