'use client';

import { useActionState, useRef } from 'react';
import { translate, type TranslateState } from './actions';
import { MAX_INPUT_LENGTH } from './prompt';
import styles from './Translator.module.css';

const examples = [
  'Vi behöver lyfta det här till en högre nivå och skapa synergier mellan teamen för att säkerställa att vi levererar värde till kunden över tid.',
  'Jag är otroligt ödmjuk och tacksam över att få dela att jag har tagit mig an en ny utmaning. Resan har bara börjat! #growth #leadership',
  'Vi har beslutat att se över vår organisation för att bättre möta framtidens behov, vilket innebär att vissa roller kommer att påverkas.',
  'Låt oss ta det offline och återkomma med en åtgärdsplan när vi har mer bandbredd.',
];

const initialState: TranslateState = { status: 'idle' };

export const Translator = () => {
  const [state, formAction, pending] = useActionState(translate, initialState);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const tryExample = (example: string) => {
    if (!textareaRef.current) return;
    textareaRef.current.value = example;
    formRef.current?.requestSubmit();
  };

  return (
    <div className={styles.wrapper}>
      <form ref={formRef} action={formAction} className={styles.form}>
        <label htmlFor="text" className="visually-hidden">
          Text att översätta
        </label>
        <textarea
          ref={textareaRef}
          id="text"
          name="text"
          className={`input ${styles.textarea}`}
          placeholder="Klistra in LinkedIn-inlägget, konsultmejlet eller myndighetsbrevet här…"
          maxLength={MAX_INPUT_LENGTH}
          defaultValue={state.status === 'idle' ? '' : state.input}
          required
        />
        <button
          className="button button-primary"
          type="submit"
          disabled={pending}
        >
          {pending ? 'Tolkar skiten…' : 'Vad i helvete betyder det?'}
        </button>
      </form>

      <div aria-live="polite">
        {state.status === 'done' && (
          <p className={styles.result}>{state.translation}</p>
        )}
        {state.status === 'error' && (
          <p className={styles.error}>{state.message}</p>
        )}
      </div>

      <div className={styles.examples}>
        <p className={styles.examplesTitle}>
          Eller prova med något av det här:
        </p>
        <ul>
          {examples.map((example) => (
            <li key={example}>
              <button
                type="button"
                className={styles.example}
                onClick={() => tryExample(example)}
                disabled={pending}
              >
                {example}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
