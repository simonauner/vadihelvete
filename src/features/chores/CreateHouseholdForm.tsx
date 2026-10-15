'use client';

import { useActionState, useId, useState } from 'react';
import { createHouseholdAction, type CreateState } from './actions';
import styles from './Chores.module.css';
import { LIMITS } from './model';
import { WhoSelect } from './WhoSelect';

type Row = { key: number; text: string; who: string };
type Props = { defaultChores: { text: string; who: string }[] };

const memberNames = (value: string) => [
  ...new Set(
    value
      .split(/\r?\n|,/)
      .map((line) => line.trim().slice(0, LIMITS.memberName))
      .filter(Boolean)
  ),
];

export const CreateHouseholdForm = ({ defaultChores }: Props) => {
  const [state, formAction, pending] = useActionState<CreateState, FormData>(
    createHouseholdAction,
    {}
  );
  const [members, setMembers] = useState('');
  const [rows, setRows] = useState<Row[]>(() =>
    defaultChores.map((chore, key) => ({ key, ...chore }))
  );
  const choresLabel = useId();
  const names = memberNames(members);

  const updateRow = (key: number, change: Partial<Row>) =>
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, ...change } : row))
    );

  const addRow = () =>
    setRows((current) => [
      ...current,
      {
        key: Math.max(-1, ...current.map((r) => r.key)) + 1,
        text: '',
        who: 'slumpa',
      },
    ]);

  return (
    <form action={formAction} className={styles.createForm}>
      <label className={styles.field}>
        <span>Vad heter hushållet?</span>
        <input
          name="name"
          className="input"
          placeholder="Familjen Andersson"
          maxLength={LIMITS.name}
        />
      </label>
      <label className={styles.field}>
        <span>Vilka bor där? En per rad.</span>
        <textarea
          name="members"
          className="input"
          rows={4}
          placeholder={'Kalle\nLisa\nOlle'}
          value={members}
          onChange={(event) => setMembers(event.target.value)}
          required
        />
      </label>
      <fieldset className={styles.field} aria-labelledby={choresLabel}>
        <span id={choresLabel}>Vilka sysslor finns, och vem ska göra dem?</span>
        <p className={styles.hint}>
          🎲 lottas ut rättvist, 👥 gör alla var för sig och 📌 har en ansvarig.
        </p>
        <ul className={styles.choreRows}>
          {rows.map((row, index) => (
            <li key={row.key} className={styles.choreRow}>
              <input
                name="chore"
                className="input"
                aria-label={`Syssla ${index + 1}`}
                placeholder="vattna blommorna"
                maxLength={LIMITS.choreText}
                value={row.text}
                onChange={(event) =>
                  updateRow(row.key, { text: event.target.value })
                }
              />
              <WhoSelect
                members={names}
                aria-label={`Vem ska ${row.text || `göra syssla ${index + 1}`}?`}
                value={row.who}
                onChange={(event) =>
                  updateRow(row.key, { who: event.target.value })
                }
              />
              <button
                type="button"
                className={styles.iconButton}
                aria-label={`Ta bort ${row.text || `syssla ${index + 1}`}`}
                title="Ta bort"
                onClick={() =>
                  setRows((current) => current.filter((r) => r.key !== row.key))
                }
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        {rows.length < LIMITS.chores && (
          <button
            type="button"
            className={`button ${styles.small}`}
            onClick={addRow}
          >
            + En syssla till
          </button>
        )}
      </fieldset>
      {state.error && <p className={styles.error}>{state.error}</p>}
      <button className="button button-primary" disabled={pending}>
        {pending ? 'Skapar…' : 'Skapa listan för i helvete'}
      </button>
    </form>
  );
};
