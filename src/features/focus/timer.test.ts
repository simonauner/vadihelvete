import { describe, expect, it } from 'vitest';
import { durationMs, formatClock, nextMode } from './timer';

describe('nextMode', () => {
  it('alternates work and short breaks', () => {
    expect(nextMode('jobba', 1)).toBe('paus');
    expect(nextMode('paus', 1)).toBe('jobba');
  });

  it('gives a long break after every fourth work session', () => {
    expect(nextMode('jobba', 4)).toBe('langpaus');
    expect(nextMode('jobba', 8)).toBe('langpaus');
    expect(nextMode('langpaus', 4)).toBe('jobba');
  });
});

describe('formatClock', () => {
  it('formats minutes and seconds, rounding up', () => {
    expect(formatClock(durationMs('jobba'))).toBe('25:00');
    expect(formatClock(61_001)).toBe('01:02');
    expect(formatClock(-5)).toBe('00:00');
  });
});
