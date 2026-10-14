import { notFound } from 'next/navigation';
import { isSuggestionCategory } from '@/features/suggestions/suggestions';

export const categoryParams = () => [{ kategori: 'hemma' }, { kategori: 'it' }];

export const resolveCategory = async (
  params: Promise<{ kategori: string }>
) => {
  const { kategori } = await params;
  if (!isSuggestionCategory(kategori)) notFound();

  return kategori;
};
