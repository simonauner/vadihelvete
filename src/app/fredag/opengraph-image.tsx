import { fridayStatus } from '@/features/friday/friday';
import { stockholmClock } from '@/features/today/calendar';
import { ogContentType, ogImage, ogSize } from '@/lib/og';

export const alt = 'Är det fredag?';
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 300;

const Image = () => {
  const status = fridayStatus(stockholmClock());

  return ogImage({
    kicker: 'Är det fredag?',
    headline: status.isFriday ? 'JA FÖR I' : 'NEJ.',
    highlight: status.isFriday ? 'HELVETE!' : status.line.split('.')[0] + '.',
    emoji: status.isFriday ? '🍻' : '😩',
  });
};

export default Image;
