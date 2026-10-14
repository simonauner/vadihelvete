import Link from 'next/link';
import styles from './SiteHeader.module.css';

export const SiteHeader = () => (
  <header className={styles.header}>
    <Link href="/" className={styles.logo}>
      vad i helvete<span className={styles.dot}>.nu</span>
    </Link>
  </header>
);
