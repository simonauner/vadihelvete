'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { areas } from '@/lib/areas';
import styles from './page.module.css';

const TYPE_MS = 55;
const ERASE_MS = 28;
const HOLD_MS = 2200;
const GAP_MS = 350;

type Phase = 'holding' | 'erasing' | 'typing';

/**
 * Types each area's question after the headline, holds it, erases it and
 * moves on. The visible completion is a link to that area. Pauses while
 * hovered or focused, and stays put on the first question for anyone who
 * prefers reduced motion.
 */
export const QuestionTyper = () => {
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(areas[0].question.length);
  const [phase, setPhase] = useState<Phase>('holding');
  const [paused, setPaused] = useState(false);

  const area = areas[index];
  const full = area.question;

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let timer: ReturnType<typeof setTimeout>;

    if (phase === 'holding') {
      timer = setTimeout(() => setPhase('erasing'), HOLD_MS);
    } else if (phase === 'erasing') {
      timer =
        shown > 0
          ? setTimeout(() => setShown(shown - 1), ERASE_MS)
          : setTimeout(() => {
              setIndex((index + 1) % areas.length);
              setPhase('typing');
            }, GAP_MS);
    } else {
      timer =
        shown < full.length
          ? setTimeout(() => setShown(shown + 1), TYPE_MS)
          : setTimeout(() => setPhase('holding'), 0);
    }

    return () => clearTimeout(timer);
  }, [phase, shown, index, full, paused]);

  const pause = () => {
    setPaused(true);
    // Whatever you are pointing at should be readable, not half erased.
    setShown(full.length);
    setPhase('holding');
  };

  return (
    <span className={styles.completion}>
      {/* Every question stacked invisibly so the hero never changes height. */}
      {areas.map((ghost) => (
        <span key={ghost.href} className={styles.ghost} aria-hidden>
          {ghost.question}
        </span>
      ))}
      <Link
        href={area.href}
        className={styles.typed}
        aria-label={full}
        onMouseEnter={pause}
        onMouseLeave={() => setPaused(false)}
        onFocus={pause}
        onBlur={() => setPaused(false)}
      >
        <span aria-hidden>{full.slice(0, shown)}</span>
        <span className={styles.caret} aria-hidden />
      </Link>
    </span>
  );
};
