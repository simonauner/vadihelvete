import type { ReactNode } from 'react';
import { SiteHeader } from './SiteHeader';
import styles from './AreaPage.module.css';

type AreaPageProps = {
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
};

/** Shared layout for the tool-like areas (väder, listor, rum, …). */
export const AreaPage = ({ title, intro, children }: AreaPageProps) => (
  <>
    <SiteHeader />
    <main className={styles.main}>
      <h1 className={styles.title}>{title}</h1>
      {intro && <p className={styles.intro}>{intro}</p>}
      {children}
    </main>
  </>
);
