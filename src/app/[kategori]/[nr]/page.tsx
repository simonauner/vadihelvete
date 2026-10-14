import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import {
  categories,
  suggestionByNumber,
} from '@/features/suggestions/suggestions';
import styles from '@/features/suggestions/SuggestionPage.module.css';
import { emojiIcon } from '@/lib/emojiIcon';
import { resolveCategory } from '../params';

type Props = { params: Promise<{ kategori: string; nr: string }> };

const resolve = async (params: Props['params']) => {
  const category = await resolveCategory(params);
  const suggestion = suggestionByNumber(category, (await params).nr);
  if (!suggestion) notFound();

  return { category, suggestion };
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { category, suggestion } = await resolve(params);

  return {
    title: { absolute: `Du kan väl för i helvete ${suggestion.text}` },
    description: 'Någon tycker att du behöver höra det här.',
    icons: { icon: emojiIcon(categories[category].emoji) },
  };
};

const SharedSuggestionPage = async ({ params }: Props) => {
  const { category, suggestion } = await resolve(params);

  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <p className={styles.kicker}>
          Någon tycker att du behöver höra det här
        </p>
        <h1 className={styles.title}>
          Du kan väl för i helvete{' '}
          <span className={styles.highlight}>{suggestion.text}</span>
        </h1>
        <Link href={`/${category}`} className="button button-primary">
          Ge mig ett eget jävla förslag
        </Link>
      </main>
    </>
  );
};

export default SharedSuggestionPage;
