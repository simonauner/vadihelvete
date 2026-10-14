import { excuseByCode } from '@/features/excuse/excuses';
import { ogContentType, ogImage, ogSize } from '@/lib/og';

type Props = { params: Promise<{ kod: string }> };

export const alt = 'En ursäkt från vad i helvete';
export const size = ogSize;
export const contentType = ogContentType;

const Image = async ({ params }: Props) => {
  const excuse = excuseByCode((await params).kod);

  return ogImage({
    kicker: 'Någon har en förklaring till dig',
    headline: excuse?.text ?? 'Förlåt.',
    emoji: '🙄',
  });
};

export default Image;
