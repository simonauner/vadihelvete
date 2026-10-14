'use client';

import { useActionState } from 'react';
import { createHouseholdAction, type CreateState } from './actions';
import styles from './Chores.module.css';

type Props = { defaultChores: string };

export const CreateHouseholdForm = ({ defaultChores }: Props) => {
  const [state, formAction, pending] = useActionState<CreateState, FormData>(
    createHouseholdAction,
    {}
  );

  return (
    <form action={formAction} className={styles.createForm}>
      <label className={styles.field}>
        <span>Vad heter hushållet?</span>
        <input
          name="name"
          className="input"
          placeholder="Familjen Andersson"
          maxLength={40}
        />
      </label>
      <label className={styles.field}>
        <span>Vilka bor där? En per rad.</span>
        <textarea
          name="members"
          className="input"
          rows={4}
          placeholder={'Kalle\nLisa\nOlle'}
          required
        />
      </label>
      <label className={styles.field}>
        <span>Vilka sysslor finns? En per rad.</span>
        <textarea
          name="chores"
          className="input"
          rows={8}
          defaultValue={defaultChores}
          required
        />
      </label>
      {state.error && <p className={styles.error}>{state.error}</p>}
      <button className="button button-primary" disabled={pending}>
        {pending ? 'Skapar…' : 'Skapa listan för i helvete'}
      </button>
    </form>
  );
};
