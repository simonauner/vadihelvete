import { describe, expect, it } from 'vitest';
import { stockholmClock } from '@/features/today/calendar';
import { formatCountdown, fridayStatus } from './friday';

const at = (weekday: number, hour: number, minute = 0) => ({
  weekday,
  secondsOfDay: hour * 3600 + minute * 60,
});

describe('fridayStatus', () => {
  it('says no on a Tuesday and counts down to Friday 17:00', () => {
    const status = fridayStatus(at(2, 9));
    expect(status.isFriday).toBe(false);
    expect(status.secondsToBeer).toBe(3 * 86_400 + 8 * 3600);
  });

  it('says yes on Friday morning but keeps counting', () => {
    const status = fridayStatus(at(5, 10));
    expect(status.isFriday).toBe(true);
    expect(status.line).toMatch(/jobba till fem/);
    expect(status.secondsToBeer).toBe(7 * 3600);
  });

  it('tells you to sneak out on Friday afternoon', () => {
    expect(fridayStatus(at(5, 15, 30)).line).toMatch(/Smit hem/);
  });

  it('stops counting after 17 on Friday', () => {
    const status = fridayStatus(at(5, 18));
    expect(status.secondsToBeer).toBeUndefined();
    expect(status.line).toMatch(/helg/);
  });

  it('does not count down on weekends', () => {
    expect(fridayStatus(at(6, 12)).secondsToBeer).toBeUndefined();
    expect(fridayStatus(at(0, 12)).secondsToBeer).toBeUndefined();
  });
});

describe('formatCountdown', () => {
  it('formats days and clock', () => {
    expect(formatCountdown(3 * 86_400 + 8 * 3600 + 5)).toBe('3 dagar 08:00:05');
    expect(formatCountdown(86_400 + 61)).toBe('1 dag 00:01:01');
    expect(formatCountdown(59)).toBe('00:00:59');
  });
});

describe('stockholmClock', () => {
  it('uses Swedish time', () => {
    // Friday 2026-10-16 15:30 UTC is 17:30 in Stockholm (CEST).
    expect(stockholmClock(new Date('2026-10-16T15:30:00Z'))).toEqual({
      weekday: 5,
      secondsOfDay: 17 * 3600 + 30 * 60,
    });
  });
});
