import type { Metadata } from 'next';
import { connection } from 'next/server';
import { ExcusePage } from '@/features/excuse/ExcusePage';
import { randomExcuse } from '@/features/excuse/excuses';
import { emojiIcon } from '@/lib/emojiIcon';

export const metadata: Metadata = {
  title: 'Vad i helvete ska jag skylla på?',
  description: 'Ursäktsgenerator för dig som kom sent. Igen.',
  icons: { icon: emojiIcon('🙄') },
};

const UrsaktPage = async () => {
  // Opt out of prerendering so every visit gets a new excuse.
  await connection();
  return <ExcusePage excuse={randomExcuse()} />;
};

export default UrsaktPage;
