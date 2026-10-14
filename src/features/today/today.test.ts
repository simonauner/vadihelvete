import { describe, expect, it } from 'vitest';
import {
  easterSunday,
  lastWeekday,
  nthWeekday,
  stockholmDate,
  weekdayName,
} from './calendar';
import { parseSwedishDay } from './swedishDay';
import { nextThemeDay, themeDaysOn } from './themeDays';

describe('calendar', () => {
  it('uses Swedish time, not UTC', () => {
    // 23:30 UTC on 3 Oct is already 4 Oct in Stockholm (CEST, UTC+2).
    expect(stockholmDate(new Date('2026-10-03T23:30:00Z'))).toEqual({
      year: 2026,
      month: 10,
      day: 4,
    });
  });

  it('knows the weekday', () => {
    expect(weekdayName({ year: 2026, month: 10, day: 14 })).toBe('onsdag');
  });

  it('computes Easter', () => {
    expect(easterSunday(2026)).toEqual({ year: 2026, month: 4, day: 5 });
    expect(easterSunday(2027)).toEqual({ year: 2027, month: 3, day: 28 });
  });

  it('finds nth and last weekdays', () => {
    // Third Thursday of October 2026 is the 15th.
    expect(nthWeekday(2026, 10, 4, 3).day).toBe(15);
    // Last Sunday of May 2026 is the 31st.
    expect(lastWeekday(2026, 5, 0).day).toBe(31);
  });
});

describe('themeDaysOn', () => {
  it('finds Kanelbullens dag', () => {
    const names = themeDaysOn({ year: 2026, month: 10, day: 4 }).map(
      (d) => d.name
    );
    expect(names).toContain('Kanelbullens dag');
  });

  it('finds movable days like Fettisdagen', () => {
    expect(themeDaysOn({ year: 2026, month: 2, day: 17 })[0]?.name).toBe(
      'Fettisdagen'
    );
    expect(themeDaysOn({ year: 2027, month: 2, day: 9 })[0]?.name).toBe(
      'Fettisdagen'
    );
  });

  it('finds the next theme day', () => {
    const next = nextThemeDay({ year: 2026, month: 10, day: 14 });
    expect(next?.inDays).toBe(1);
    expect(next?.days.map((d) => d.name)).toContain('Grynkorvens dag');
  });
});

describe('parseSwedishDay', () => {
  it('reads the sholiday response', () => {
    expect(
      parseSwedishDay({
        dagar: [
          {
            datum: '2026-06-06',
            vecka: '23',
            'röd dag': 'Ja',
            helgdag: 'Sveriges nationaldag',
            namnsdag: ['Gustav', 'Gösta'],
            flaggdag: 'Sveriges nationaldag och svenska flaggans dag',
          },
        ],
      })
    ).toEqual({
      week: 23,
      holiday: 'Sveriges nationaldag',
      holidayEve: undefined,
      redDay: true,
      nameDays: ['Gustav', 'Gösta'],
      flagDay: 'Sveriges nationaldag och svenska flaggans dag',
    });
  });

  it('treats an empty flag day as none', () => {
    expect(
      parseSwedishDay({ dagar: [{ vecka: '42', namnsdag: [], flaggdag: '' }] })
        ?.flagDay
    ).toBeUndefined();
  });

  it('handles garbage', () => {
    expect(parseSwedishDay(null)).toBeNull();
  });
});
