import { describe, expect, it } from 'vitest';
import { addDays, bankHolidays, isBankDay } from '@/features/today/calendar';
import { paydayComment, paydayIn, paydayStatus } from './payday';

describe('isBankDay', () => {
  it('treats weekends and holidays as closed', () => {
    expect(isBankDay({ year: 2026, month: 10, day: 24 })).toBe(false); // Sat
    expect(isBankDay({ year: 2026, month: 12, day: 24 })).toBe(false); // julafton
    expect(isBankDay({ year: 2026, month: 10, day: 14 })).toBe(true);
  });

  it('finds midsommarafton', () => {
    expect(bankHolidays(2026)).toContainEqual({
      year: 2026,
      month: 6,
      day: 19,
    });
    expect(bankHolidays(2027)).toContainEqual({
      year: 2027,
      month: 6,
      day: 25,
    });
  });
});

describe('paydayIn', () => {
  it('keeps the 25th on a weekday', () => {
    expect(paydayIn(2026, 5)).toEqual({ year: 2026, month: 5, day: 25 });
  });

  it('moves back from a weekend', () => {
    expect(paydayIn(2026, 10)).toEqual({ year: 2026, month: 10, day: 23 });
  });

  it('moves back past Christmas', () => {
    expect(paydayIn(2026, 12)).toEqual({ year: 2026, month: 12, day: 23 });
  });

  it('moves back from midsommarafton', () => {
    expect(paydayIn(2027, 6)).toEqual({ year: 2027, month: 6, day: 24 });
  });

  it('clamps to short months', () => {
    expect(paydayIn(2026, 2, 31).day).toBeLessThanOrEqual(28);
  });
});

describe('paydayStatus', () => {
  it('counts down to this month when it is ahead', () => {
    const status = paydayStatus({ year: 2026, month: 10, day: 14 });
    expect(status.next).toEqual({ year: 2026, month: 10, day: 23 });
    expect(status.daysUntil).toBe(9);
    expect(status.previous).toEqual({ year: 2026, month: 9, day: 25 });
  });

  it('rolls over to next month after payday', () => {
    const status = paydayStatus({ year: 2026, month: 10, day: 26 });
    expect(status.next).toEqual({ year: 2026, month: 11, day: 25 });
    expect(status.daysSince).toBe(3);
  });

  it('handles new year', () => {
    expect(paydayStatus({ year: 2026, month: 12, day: 28 }).next).toEqual({
      year: 2027,
      month: 1,
      day: 25,
    });
  });

  it('celebrates on payday', () => {
    const today = { year: 2026, month: 10, day: 23 };
    const status = paydayStatus(today);
    expect(status.daysUntil).toBe(0);
    expect(paydayComment(status, today)).toMatch(/idag|lönedag|pengarna/i);
  });
});

describe('paydayComment', () => {
  const midMonth = paydayStatus({ year: 2026, month: 10, day: 14 });

  it('keeps the same comment all day', () => {
    const today = { year: 2026, month: 10, day: 14 };
    expect(paydayComment(midMonth, today)).toBe(
      paydayComment(midMonth, { ...today })
    );
  });

  it('varies between days', () => {
    const start = { year: 2026, month: 10, day: 1 };
    const comments = new Set(
      Array.from({ length: 30 }, (_, i) =>
        paydayComment(midMonth, addDays(start, i))
      )
    );
    expect(comments.size).toBeGreaterThan(1);
  });

  it('says how long ago payday was', () => {
    const today = { year: 2026, month: 10, day: 26 };
    expect(paydayComment(paydayStatus(today), today)).toMatch(/3 dagar/);
  });
});
