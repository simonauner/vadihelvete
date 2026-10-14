import type { Metadata } from 'next';
import { SuggestionPage } from '@/features/suggestions/SuggestionPage';
import { emojiIcon } from '@/lib/emojiIcon';

export const metadata: Metadata = {
  title: 'Vad i helvete ska jag koda nu?',
  icons: { icon: emojiIcon('🖥️') },
};

const ItPage = () => <SuggestionPage category="it" />;

export default ItPage;
