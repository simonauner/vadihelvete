import { ogContentType, ogImage, ogSize } from '@/lib/og';

export const alt = 'Vad i helvete ska jag göra nu?';
export const size = ogSize;
export const contentType = ogContentType;

const Image = () =>
  ogImage({
    kicker: 'Vet du inte vad du ska göra?',
    headline: 'Vad i helvete',
    highlight: 'ska jag göra nu?',
    emoji: '🎯',
  });

export default Image;
