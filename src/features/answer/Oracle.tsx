'use client';

import { useRef, useState } from 'react';
import { pickAnswer, type Answer } from './answers';
import styles from './Oracle.module.css';

const THINKING_MS = 900;

export const Oracle = () => {
  const [answer, setAnswer] = useState<Answer>();
  const [thinking, setThinking] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const ask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearTimeout(timer.current);
    setThinking(true);
    timer.current = setTimeout(() => {
      setAnswer((previous) => pickAnswer(previous));
      setThinking(false);
    }, THINKING_MS);
  };

  return (
    <form onSubmit={ask} className={styles.form}>
      <label htmlFor="question" className="visually-hidden">
        Din fråga
      </label>
      {/* The question never leaves the browser; it is only for show. */}
      <input
        id="question"
        className="input"
        placeholder="Ska jag ringa mitt ex?"
        maxLength={140}
        autoComplete="off"
      />
      <button className="button button-primary" disabled={thinking}>
        Svara för i helvete
      </button>

      <div
        className={`${styles.ball} ${thinking ? styles.shaking : ''}`}
        aria-live="polite"
      >
        <div className={styles.window}>
          {thinking ? (
            <span className={styles.dots}>…</span>
          ) : answer ? (
            <span className={`${styles.answer} ${styles[answer.mood]}`}>
              {answer.text}
            </span>
          ) : (
            <span className={styles.idle}>Fråga då.</span>
          )}
        </div>
      </div>
    </form>
  );
};
