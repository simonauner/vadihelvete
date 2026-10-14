'use client';

import { useEffect, useState } from 'react';
import { stockholmClock, type Clock } from '@/features/today/calendar';
import { formatCountdown, fridayStatus } from './friday';
import styles from './Friday.module.css';

type Props = { initialClock: Clock };

export const FridayView = ({ initialClock }: Props) => {
  const [clock, setClock] = useState(initialClock);

  useEffect(() => {
    const tick = () => setClock(stockholmClock());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const status = fridayStatus(clock);

  return (
    <>
      <h1 className={status.isFriday ? styles.yes : styles.no}>
        {status.isFriday ? 'JA!' : 'NEJ.'}
      </h1>
      <p className={styles.line}>{status.line}</p>
      {status.secondsToBeer !== undefined && (
        <p className={styles.countdown}>
          <span className={styles.timer}>
            {formatCountdown(status.secondsToBeer)}
          </span>{' '}
          kvar till fredagsölen.
        </p>
      )}
    </>
  );
};
