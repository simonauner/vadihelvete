import type { Metadata } from 'next';
import { AreaPage } from '@/components/AreaPage';
import { Translator } from '@/features/translate/Translator';
import { emojiIcon } from '@/lib/emojiIcon';

export const metadata: Metadata = {
  title: 'Vad i helvete betyder det?',
  description:
    'Översätter LinkedIn-svammel, konsultsvenska och myndighetsprosa till vanlig svenska.',
  icons: { icon: emojiIcon('🗯️') },
};

const OversattPage = () => (
  <AreaPage
    title="Vad i helvete betyder det?"
    intro="Klistra in LinkedIn-svammel, konsultsvenska eller myndighetsprosa så säger jag vad det faktiskt betyder."
  >
    <Translator />
  </AreaPage>
);

export default OversattPage;
