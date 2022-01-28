import React, { FunctionComponent } from 'react';
import { log } from '../../browserLogger';
import { Button } from '../Button';
import { Head } from '../Head';
import styles from './Page.module.css';

type HomePageProps = {
  suggestion: string;
  favicon?: string;
};

export const Page: FunctionComponent<HomePageProps> = ({
  suggestion,
  favicon,
}) => {
  const handleClick = () => {
    location.reload();
  };

  log(
    'Hej! Kul att du är här! Nu måste du verkligen inte ha någonting att göra om du t.o.m öppnar upp devtools för en sida som ger förslag på något riktigt att göra!'
  );
  log(
    'Har du fler bra förslag på vad man kan göra? https://github.com/simonauner/vadihelvete'
  );

  return (
    <div className={styles.container}>
      <Head favicon={favicon} />

      <main className={styles.main}>
        {!suggestion && (
          <h1 className={styles.title}>Helvete vad duktig du är då</h1>
        )}
        {suggestion && (
          <>
            <h1 className={styles.title}>
              Du kan väl för i helvete {suggestion}
            </h1>

            <p className={styles.description}>
              <Button onClick={handleClick}>
                Det har jag ju för i helvete redan gjort
              </Button>
            </p>
          </>
        )}
      </main>
    </div>
  );
};
