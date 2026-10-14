import Link from 'next/link';
import { areaGroups } from '@/lib/areas';
import { QuestionTyper } from './QuestionTyper';
import styles from './page.module.css';

const StartPage = () => (
  <main className={styles.main}>
    <section className={styles.hero}>
      <h1 className={styles.title}>
        <span className={styles.lead}>
          Vad i <span className={styles.accent}>helvete</span>…
        </span>
        <QuestionTyper />
      </h1>
      <p className={styles.hint}>
        Klicka när den frågar rätt sak. Eller vänta, du har ju ändå inget bättre
        för dig.
      </p>
    </section>

    <section aria-labelledby="alla" className={styles.rest}>
      <h2 id="alla" className={styles.restTitle}>
        Orkar du inte vänta?
      </h2>
      {areaGroups
        .filter((group) => group.areas.length)
        .map((group) => (
          <section key={group.title} className={styles.group}>
            <h3 className={styles.groupTitle}>{group.title}</h3>
            <ul className={styles.list}>
              {group.areas.map((area) => (
                <li key={area.href}>
                  <Link href={area.href} className={styles.item}>
                    <span className={styles.emoji} aria-hidden>
                      {area.emoji}
                    </span>
                    <span className={styles.text}>
                      <span className={styles.question}>…{area.question}</span>
                      <span className={styles.description}>
                        {area.description}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
    </section>

    <footer className={styles.footer}>
      Har du en bättre idé? Gör en jävla{' '}
      <a href="https://github.com/simonauner/vadihelvete">pull request</a> då.
      <a href="https://hackskaduha.se" className={styles.credit}>
        Ett hittepå från Hack ska du ha AB. För i helvete.
      </a>
    </footer>
  </main>
);

export default StartPage;
