import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import {
  DEFAULT_PAYDAY,
  paydayComment,
  paydayStatus,
} from '@/features/payday/payday';
import { PaydaySelect } from '@/features/payday/PaydaySelect';
import { stockholmDate } from '@/features/today/calendar';
import { formatDate } from '@/features/today/today';
import { emojiIcon } from '@/lib/emojiIcon';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Vad i helvete, när kommer lönen?',
  description:
    'Nedräkning till lönedagen, med hänsyn till helger och röda dagar.',
  icons: { icon: emojiIcon('💸') },
};

type Props = { searchParams: Promise<{ dag?: string | string[] }> };

const parseDay = (value: string | string[] | undefined) => {
  const day = Number(typeof value === 'string' ? value : NaN);
  return Number.isInteger(day) && day >= 1 && day <= 31 ? day : DEFAULT_PAYDAY;
};

const LonPage = async ({ searchParams }: Props) => {
  const dayOfMonth = parseDay((await searchParams).dag);
  const status = paydayStatus(stockholmDate(), dayOfMonth);

  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <p className={styles.kicker}>Vad i helvete, när kommer lönen?</p>
        <h1 className={styles.title}>
          {status.daysUntil === 0 ? (
            <span className={styles.accent}>Idag!</span>
          ) : (
            <>
              Om{' '}
              <span className={styles.accent}>
                {status.daysUntil === 1
                  ? 'en dag'
                  : `${status.daysUntil} dagar`}
              </span>
              .
            </>
          )}
        </h1>
        {status.daysUntil > 0 && (
          <p className={styles.date}>{formatDate(status.next)}</p>
        )}
        <p className={styles.comment}>{paydayComment(status)}</p>

        <div className={styles.footer}>
          <PaydaySelect dayOfMonth={dayOfMonth} />
          <p>
            Hamnar lönedagen på en helg eller röd dag räknar jag med bankdagen
            före.
          </p>
        </div>
      </main>
    </>
  );
};

export default LonPage;
