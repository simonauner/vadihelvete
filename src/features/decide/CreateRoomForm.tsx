'use client';

import { useActionState, useState } from 'react';
import styles from '@/features/chores/Chores.module.css';
import { createRoomAction, type CreateRoomState } from './actions';
import { LIMITS, presets } from './model';
import roomStyles from './Room.module.css';

export const CreateRoomForm = () => {
  const [state, formAction, pending] = useActionState<
    CreateRoomState,
    FormData
  >(createRoomAction, {});
  const [question, setQuestion] = useState(presets[0].question);
  const [options, setOptions] = useState(presets[0].options.join('\n'));

  return (
    <form action={formAction} className={styles.createForm}>
      <div className={roomStyles.presets}>
        {presets.map((preset) => (
          <button
            key={preset.slug}
            type="button"
            className={`button ${styles.small}`}
            aria-pressed={question === preset.question}
            onClick={() => {
              setQuestion(preset.question);
              setOptions(preset.options.join('\n'));
            }}
          >
            {preset.question.replace('Vad i helvete ska vi ', '…')}
          </button>
        ))}
      </div>
      <label className={styles.field}>
        <span>Frågan</span>
        <input
          name="question"
          className="input"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          maxLength={LIMITS.question}
        />
      </label>
      <label className={styles.field}>
        <span>Alternativ, ett per rad</span>
        <textarea
          name="options"
          className="input"
          rows={7}
          value={options}
          onChange={(event) => setOptions(event.target.value)}
          required
        />
      </label>
      {state.error && <p className={styles.error}>{state.error}</p>}
      <button className="button button-primary" disabled={pending}>
        {pending ? 'Skapar…' : 'Skapa rummet för i helvete'}
      </button>
    </form>
  );
};
