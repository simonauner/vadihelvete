import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AreaPage } from '@/components/AreaPage';
import { ShareButton } from '@/components/ShareButton';
import choreStyles from '@/features/chores/Chores.module.css';
import {
  addOptionAction,
  decideAction,
  resetAction,
  voteAction,
} from '@/features/decide/actions';
import { AutoRefresh } from '@/features/decide/AutoRefresh';
import { LIMITS } from '@/features/decide/model';
import styles from '@/features/decide/Room.module.css';
import { loadRoom } from '@/features/decide/store';
import { getVoterId } from '@/features/decide/voter';
import { emojiIcon } from '@/lib/emojiIcon';
import { StoreMissing } from '@/lib/StoreMissing';
import { isId, isStoreConfigured } from '@/lib/store';

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { id } = await params;
  const room = isStoreConfigured() && isId(id) ? await loadRoom(id) : null;

  return {
    title: { absolute: room?.question ?? 'Vad i helvete ska vi göra?' },
    description: 'Rösta nu för i helvete, annars bestämmer någon annan.',
    icons: { icon: emojiIcon('🗳️') },
    robots: { index: false },
  };
};

const RoomPage = async ({ params }: Props) => {
  if (!isStoreConfigured()) return <StoreMissing />;

  const { id } = await params;
  const room = isId(id) ? await loadRoom(id) : null;
  if (!room) notFound();

  const voter = await getVoterId();
  const totalVotes = room.options.reduce((n, o) => n + o.voters.length, 0);
  const winner = room.options.find((o) => o.id === room.decision?.optionId);
  const decided = Boolean(room.decision);

  return (
    <AreaPage title={room.question}>
      <AutoRefresh />

      {winner && room.decision && (
        <section className={styles.decision} aria-live="polite">
          <h2 className={styles.decisionTitle}>
            Det blir för i helvete {winner.text}.
          </h2>
          <p className={styles.decisionNote}>
            {room.decision.byVotes
              ? `${winner.voters.length} av ${totalVotes} röster. Inga diskussioner.`
              : 'Ingen kunde bestämma sig, så jag valde åt er. Inga diskussioner.'}
          </p>
        </section>
      )}

      {!decided && (
        <p className={styles.hint}>
          Klicka för att rösta. Klicka igen för att ångra dig, din velpotta.
        </p>
      )}

      <ul className={styles.options}>
        {room.options.map((option) => {
          const mine = voter ? option.voters.includes(voter) : false;
          const share = totalVotes ? option.voters.length / totalVotes : 0;
          const classes = [
            styles.option,
            mine ? styles.mine : '',
            option.id === winner?.id ? styles.winner : '',
          ].join(' ');

          return (
            <li key={option.id}>
              <form action={voteAction.bind(null, id, option.id)}>
                <button
                  className={classes}
                  disabled={decided}
                  aria-pressed={mine}
                >
                  <span
                    className={styles.bar}
                    style={{ width: `${share * 100}%` }}
                  />
                  <span className={styles.optionText}>
                    {option.text}
                    {mine && ' ← din röst'}
                  </span>
                  <span className={styles.count}>{option.voters.length}</span>
                </button>
              </form>
            </li>
          );
        })}
      </ul>

      <div className={styles.actions}>
        {decided ? (
          <form action={resetAction.bind(null, id)}>
            <button className="button">Börja om, vi ångrar oss</button>
          </form>
        ) : (
          <form action={decideAction.bind(null, id)}>
            <button className="button button-primary">
              Avgör nu för i helvete
            </button>
          </form>
        )}
        <ShareButton
          path={`/bestam/${id}`}
          text={`${room.question} Rösta nu för i helvete.`}
          label="Skicka länken till gänget"
        />
      </div>

      {!decided && room.options.length < LIMITS.options && (
        <form
          action={addOptionAction.bind(null, id)}
          className={choreStyles.inlineForm}
        >
          <label htmlFor="new-option" className="visually-hidden">
            Nytt alternativ
          </label>
          <input
            id="new-option"
            name="text"
            className="input"
            placeholder="Något annat då?"
            maxLength={LIMITS.optionText}
            required
          />
          <button className="button">Lägg till</button>
        </form>
      )}
    </AreaPage>
  );
};

export default RoomPage;
