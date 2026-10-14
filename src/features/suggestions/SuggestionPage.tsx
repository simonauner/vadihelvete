import { SiteHeader } from '@/components/SiteHeader';
import { markDone, startOver } from './actions';
import { getSeen } from './seen';
import { pickSuggestion } from './suggestions';
import type { SuggestionCategory } from './types';
import styles from './SuggestionPage.module.css';

type SuggestionPageProps = {
  category: SuggestionCategory;
};

export const SuggestionPage = async ({ category }: SuggestionPageProps) => {
  const suggestion = pickSuggestion(category, await getSeen());

  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        {suggestion ? (
          <>
            <h1 className={styles.title}>
              Du kan väl för i helvete{' '}
              <span className={styles.highlight}>{suggestion.text}</span>
            </h1>
            <form action={markDone.bind(null, category, suggestion.index)}>
              <button className="button button-primary" type="submit">
                Det har jag ju för i helvete redan gjort
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Helvete vad duktig du är då</h1>
            <form action={startOver.bind(null, category)}>
              <button className="button" type="submit">
                Ge mig mer att göra då
              </button>
            </form>
          </>
        )}
      </main>
    </>
  );
};
