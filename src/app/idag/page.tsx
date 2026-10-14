import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { stockholmDate, weekdayName } from '@/features/today/calendar';
import { describeDay, formatDate } from '@/features/today/today';
import { emojiIcon } from '@/lib/emojiIcon';
import styles from './page.module.css';

// The date changes at midnight, so re-render at most every ten minutes.
export const revalidate = 600;

export const generateMetadata = (): Metadata => {
  const today = stockholmDate();

  return {
    title: 'Vad i helvete är det för dag idag?',
    description: `Temadag, namnsdag och flaggdag för ${formatDate(today)}.`,
    icons: { icon: emojiIcon('📅') },
  };
};

const IdagPage = async () => {
  const today = stockholmDate();
  const { themeDays, week, lines } = await describeDay(today);
  const [main, ...others] = themeDays;

  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <p className={styles.kicker}>
          {formatDate(today)}
          {week ? ` · vecka ${week}` : ''}
        </p>

        {main ? (
          <h1 className={styles.title}>
            Det är för i helvete{' '}
            <span className={styles.accent}>{main.name}</span>{' '}
            <span aria-hidden>{main.emoji}</span>
          </h1>
        ) : (
          <h1 className={styles.title}>
            Det är ingen jävla temadag idag. Det är bara{' '}
            <span className={styles.accent}>{weekdayName(today)}</span>.
          </h1>
        )}

        {others.length > 0 && (
          <p className={styles.also}>
            Och{' '}
            {others.map((day, index) => (
              <span key={day.name}>
                {index > 0 && (index === others.length - 1 ? ' och ' : ', ')}
                {day.name} {day.emoji}
              </span>
            ))}{' '}
            också, om du nu bryr dig.
          </p>
        )}

        <ul className={styles.lines}>
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <p className={styles.credit}>
          Namnsdagar och helgdagar från{' '}
          <a href="https://sholiday.faboul.se">sholiday.faboul.se</a>.
          Temadagarna är mest påhittade av livsmedelsbranschen.
        </p>
      </main>
    </>
  );
};

export default IdagPage;
