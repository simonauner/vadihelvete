import { paydayStatus } from '@/features/payday/payday';
import { stockholmDate } from '@/features/today/calendar';
import { ogContentType, ogImage, ogSize } from '@/lib/og';

export const alt = 'Vad i helvete, när kommer lönen?';
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 600;

const Image = () => {
  const { daysUntil } = paydayStatus(stockholmDate());

  return ogImage({
    kicker: 'Vad i helvete, när kommer lönen?',
    headline: daysUntil === 0 ? 'Lönen kommer' : 'Om',
    highlight:
      daysUntil === 0
        ? 'idag!'
        : daysUntil === 1
          ? 'en dag.'
          : `${daysUntil} dagar.`,
    emoji: '💸',
  });
};

export default Image;
