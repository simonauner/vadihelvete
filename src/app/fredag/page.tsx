import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { FridayView } from '@/features/friday/FridayView';
import { stockholmClock } from '@/features/today/calendar';
import { emojiIcon } from '@/lib/emojiIcon';
import styles from '@/components/BigPage.module.css';

export const metadata: Metadata = {
  title: 'Är det fredag?',
  description: 'Nej. Eller jo. Kolla själv för i helvete.',
  icons: { icon: emojiIcon('🍻') },
};

// Server-rendered answer stays fresh; the countdown ticks in the browser.
export const revalidate = 300;

const FredagPage = () => (
  <>
    <SiteHeader />
    <main className={styles.main}>
      <p className={styles.kicker}>Är det fredag?</p>
      <FridayView initialClock={stockholmClock()} />
    </main>
  </>
);

export default FredagPage;
