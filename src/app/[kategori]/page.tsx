import type { Metadata } from 'next';
import { SuggestionPage } from '@/features/suggestions/SuggestionPage';
import { categories } from '@/features/suggestions/suggestions';
import { emojiIcon } from '@/lib/emojiIcon';
import { categoryParams, resolveCategory } from './params';

type Props = { params: Promise<{ kategori: string }> };

export const dynamicParams = false;
export const generateStaticParams = categoryParams;

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { title, emoji } = categories[await resolveCategory(params)];

  return { title: { absolute: title }, icons: { icon: emojiIcon(emoji) } };
};

const CategoryPage = async ({ params }: Props) => (
  <SuggestionPage category={await resolveCategory(params)} />
);

export default CategoryPage;
