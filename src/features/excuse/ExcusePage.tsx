import { ShareButton } from '@/components/ShareButton';
import { SiteHeader } from '@/components/SiteHeader';
import styles from '@/features/suggestions/SuggestionPage.module.css';
import type { Excuse } from './excuses';

type Props = { excuse: Excuse; shared?: boolean };

export const ExcusePage = ({ excuse, shared }: Props) => (
  <>
    <SiteHeader />
    <main className={styles.main}>
      <p className={styles.kicker}>
        {shared
          ? 'Någon har en förklaring till dig'
          : 'Vad i helvete ska jag skylla på?'}
      </p>
      <h1 className={`${styles.title} ${styles.wide}`}>{excuse.text}</h1>
      <div className={styles.actions}>
        {/* A plain GET form forces a full request, so the server picks a new excuse. */}
        <form method="get" action="/ursakt">
          <button className="button button-primary">
            {shared
              ? 'Ge mig en egen ursäkt'
              : 'Den köper ingen, ge mig en annan'}
          </button>
        </form>
        <ShareButton
          path={`/ursakt/${excuse.code}`}
          text={excuse.text}
          label="Skicka ursäkten"
        />
      </div>
    </main>
  </>
);
