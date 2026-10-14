const format = new Intl.RelativeTimeFormat('sv', { numeric: 'auto' });

const steps: [Intl.RelativeTimeFormatUnit, number][] = [
  ['day', 24 * 60 * 60 * 1000],
  ['hour', 60 * 60 * 1000],
  ['minute', 60 * 1000],
];

/** "för 3 dagar sedan", "i går", "nu" */
export const relativeTime = (timestamp: number, now = Date.now()) => {
  const diff = timestamp - now;

  for (const [unit, ms] of steps) {
    if (Math.abs(diff) >= ms) return format.format(Math.round(diff / ms), unit);
  }

  return 'nyss';
};
