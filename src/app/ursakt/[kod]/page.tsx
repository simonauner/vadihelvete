import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ExcusePage } from '@/features/excuse/ExcusePage';
import { excuseByCode } from '@/features/excuse/excuses';
import { emojiIcon } from '@/lib/emojiIcon';

type Props = { params: Promise<{ kod: string }> };

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const excuse = excuseByCode((await params).kod);

  return {
    title: { absolute: excuse?.text ?? 'Vad i helvete ska jag skylla på?' },
    description: 'Någon har en förklaring till dig.',
    icons: { icon: emojiIcon('🙄') },
  };
};

const SharedExcusePage = async ({ params }: Props) => {
  const excuse = excuseByCode((await params).kod);
  if (!excuse) notFound();

  return <ExcusePage excuse={excuse} shared />;
};

export default SharedExcusePage;
