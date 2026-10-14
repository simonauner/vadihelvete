import {
  categories,
  isSuggestionCategory,
  suggestionByNumber,
} from '@/features/suggestions/suggestions';
import { ogContentType, ogImage, ogSize } from '@/lib/og';

type Props = { params: Promise<{ kategori: string; nr: string }> };

export const alt = 'Ett argt förslag från vad i helvete';
export const size = ogSize;
export const contentType = ogContentType;

const Image = async ({ params }: Props) => {
  const { kategori, nr } = await params;
  const suggestion = isSuggestionCategory(kategori)
    ? suggestionByNumber(kategori, nr)
    : undefined;

  return ogImage({
    kicker: 'Någon tycker att du behöver höra det här',
    headline: 'Du kan väl för i helvete',
    highlight: suggestion?.text ?? 'göra något vettigt',
    emoji: isSuggestionCategory(kategori)
      ? categories[kategori].emoji
      : undefined,
  });
};

export default Image;
