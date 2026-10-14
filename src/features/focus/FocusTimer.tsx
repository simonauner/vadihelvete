'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { durationMs, formatClock, modes, nextMode, type Mode } from './timer';
import styles from './Focus.module.css';

type Status = 'idle' | 'running' | 'paused';

const STORAGE_KEY = 'fokus:completed';

const readCompleted = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    const today = new Date().toDateString();
    return stored?.day === today ? Number(stored.count) || 0 : 0;
  } catch {
    return 0;
  }
};

const writeCompleted = (count: number) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ day: new Date().toDateString(), count })
    );
  } catch {
    // Private mode or blocked storage: the counter just resets.
  }
  listeners.forEach((listener) => listener());
};

// The daily counter lives in localStorage; this keeps React in sync with it
// (and with other tabs) without a hydration mismatch.
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
};

const beep = () => {
  try {
    const audio = new AudioContext();
    [0, 0.25, 0.5].forEach((offset) => {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.2, audio.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audio.currentTime + offset + 0.2
      );
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start(audio.currentTime + offset);
      oscillator.stop(audio.currentTime + offset + 0.2);
    });
  } catch {
    // No audio, no beep.
  }
};

const notify = (text: string) => {
  if (typeof Notification === 'undefined') return;
  if (Notification.permission === 'granted') {
    new Notification('vad i helvete', { body: text });
  }
};

export const FocusTimer = () => {
  const [mode, setMode] = useState<Mode>('jobba');
  const [status, setStatus] = useState<Status>('idle');
  const [remaining, setRemaining] = useState(durationMs('jobba'));
  const completed = useSyncExternalStore(subscribe, readCompleted, () => 0);
  const [message, setMessage] = useState<string>();
  const endsAt = useRef(0);

  const switchMode = useCallback((next: Mode) => {
    setMode(next);
    setStatus('idle');
    setRemaining(durationMs(next));
  }, []);

  const finish = useCallback(() => {
    const done = modes[mode].done;
    const count = mode === 'jobba' ? completed + 1 : completed;
    if (mode === 'jobba') writeCompleted(count);
    beep();
    notify(done);
    setMessage(done);
    switchMode(nextMode(mode, count));
  }, [completed, mode, switchMode]);

  useEffect(() => {
    if (status !== 'running') return;

    const timer = setInterval(() => {
      const left = endsAt.current - Date.now();
      if (left <= 0) finish();
      else setRemaining(left);
    }, 250);

    return () => clearInterval(timer);
  }, [status, finish]);

  useEffect(() => {
    if (status === 'idle') return;
    const original = document.title;
    document.title = `${formatClock(remaining)} – ${modes[mode].label}`;
    return () => {
      document.title = original;
    };
  }, [mode, remaining, status]);

  const start = () => {
    if (
      typeof Notification !== 'undefined' &&
      Notification.permission === 'default'
    ) {
      void Notification.requestPermission();
    }
    endsAt.current = Date.now() + remaining;
    setMessage(undefined);
    setStatus('running');
  };

  const headline =
    status === 'running'
      ? modes[mode].running
      : status === 'paused'
        ? mode === 'jobba'
          ? 'Varför pausar du? Fortsätt för i helvete.'
          : 'Pausar du pausen? Okej då.'
        : (message ?? 'Redo att jobba? Tryck på start för i helvete.');

  return (
    <div className={styles.wrapper}>
      <div className={styles.modes} role="tablist" aria-label="Läge">
        {(Object.keys(modes) as Mode[]).map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={mode === option}
            className={styles.mode}
            onClick={() => {
              setMessage(undefined);
              switchMode(option);
            }}
          >
            {modes[option].label}
          </button>
        ))}
      </div>

      <p className={styles.clock} aria-live="off">
        {formatClock(remaining)}
      </p>
      <p className={styles.headline} aria-live="polite">
        {headline}
      </p>

      <div className={styles.controls}>
        {status === 'running' ? (
          <button
            type="button"
            className="button"
            onClick={() => setStatus('paused')}
          >
            Pausa
          </button>
        ) : (
          <button
            type="button"
            className="button button-primary"
            onClick={start}
          >
            {status === 'paused' ? 'Fortsätt' : 'Start'}
          </button>
        )}
        {status !== 'idle' && (
          <button
            type="button"
            className="button"
            onClick={() => switchMode(mode)}
          >
            Börja om
          </button>
        )}
      </div>

      <p className={styles.count}>
        {completed === 0
          ? 'Du har inte jobbat ett jävla pass idag.'
          : `${completed} pass idag. ${
              completed >= 8 ? 'Gå hem för i helvete.' : 'Fortsätt.'
            }`}
      </p>
    </div>
  );
};
