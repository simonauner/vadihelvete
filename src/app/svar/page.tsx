import type { Metadata } from 'next';
import { AreaPage } from '@/components/AreaPage';
import { Oracle } from '@/features/answer/Oracle';
import { emojiIcon } from '@/lib/emojiIcon';

export const metadata: Metadata = {
  title: 'Vad i helvete ska jag svara?',
  description: 'En arg spåkula. Ställ en ja/nej-fråga och få ett ärligt svar.',
  icons: { icon: emojiIcon('🎱') },
};

const SvarPage = () => (
  <AreaPage
    title="Ska jag…?"
    intro="Ställ en ja/nej-fråga. Spåkulan svarar ärligt, och frågan stannar i din webbläsare."
  >
    <Oracle />
  </AreaPage>
);

export default SvarPage;
