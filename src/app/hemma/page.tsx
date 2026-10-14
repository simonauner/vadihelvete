import type { Metadata } from 'next';
import { SuggestionPage } from '@/features/suggestions/SuggestionPage';
import { emojiIcon } from '@/lib/emojiIcon';

export const metadata: Metadata = {
  title: 'Vad i helvete ska jag göra hemma?',
  icons: { icon: emojiIcon('🧹') },
};

const HemmaPage = () => <SuggestionPage category="hemma" />;

export default HemmaPage;
