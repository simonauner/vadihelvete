import { stockholmDate, weekdayName } from '@/features/today/calendar';
import { themeDaysOn } from '@/features/today/themeDays';
import { ogContentType, ogImage, ogSize } from '@/lib/og';

export const alt = 'Vad i helvete är det för dag idag?';
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 600;

const Image = () => {
  const today = stockholmDate();
  const [main] = themeDaysOn(today);

  return ogImage({
    kicker: 'Vad i helvete är det för dag idag?',
    headline: main ? 'Det är för i helvete' : 'Det är bara',
    highlight: main ? main.name : weekdayName(today),
    emoji: main?.emoji ?? '📅',
  });
};

export default Image;
