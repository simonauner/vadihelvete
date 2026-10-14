import Link from 'next/link';
import { areaGroups } from '@/lib/areas';
import styles from './page.module.css';

const StartPage = () => (
  <main className={styles.main}>
    <h1 className={styles.title}>
      Vad i <span className={styles.accent}>helvete</span>…
    </h1>

    {areaGroups
      .filter((group) => group.areas.length)
      .map((group) => (
        <section key={group.title} className={styles.group}>
          <h2 className={styles.groupTitle}>{group.title}</h2>
          <ul className={styles.grid}>
            {group.areas.map((area) => (
              <li key={area.href}>
                <Link href={area.href} className={styles.card}>
                  <span className={styles.emoji} aria-hidden>
                    {area.emoji}
                  </span>
                  <span className={styles.question}>…{area.question}</span>
                  <span className={styles.description}>{area.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

    <footer className={styles.footer}>
      Har du en bättre idé? Gör en jävla{' '}
      <a href="https://github.com/simonauner/vadihelvete">pull request</a> då.
    </footer>
  </main>
);

export default StartPage;
