import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AreaPage } from '@/components/AreaPage';
import { ShareButton } from '@/components/ShareButton';
import {
  addChoreAction,
  addMemberAction,
  completeChoreAction,
  passChoreAction,
  removeChoreAction,
  removeMemberAction,
} from '@/features/chores/actions';
import styles from '@/features/chores/Chores.module.css';
import { LIMITS, whoseTurn } from '@/features/chores/model';
import { loadHousehold } from '@/features/chores/store';
import { emojiIcon } from '@/lib/emojiIcon';
import { relativeTime } from '@/lib/relativeTime';
import { StoreMissing } from '@/lib/StoreMissing';
import { isId, isStoreConfigured } from '@/lib/store';

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: 'Vem i helvete ska göra vad?',
  description: 'Vår sysslolista. Kolla vems tur det är för i helvete.',
  icons: { icon: emojiIcon('🧽') },
  robots: { index: false },
};

const HouseholdPage = async ({ params }: Props) => {
  if (!isStoreConfigured()) return <StoreMissing />;

  const { id } = await params;
  const household = isId(id) ? await loadHousehold(id) : null;
  if (!household) notFound();

  const byMember = household.members.map((member) => ({
    member,
    chores: household.chores.filter(
      (chore) => whoseTurn(household, chore) === member
    ),
  }));

  return (
    <AreaPage
      title={
        <>
          Vem i helvete ska göra vad hos{' '}
          <span className={styles.accent}>{household.name}</span>?
        </>
      }
    >
      <div className={styles.people}>
        {byMember.map(({ member, chores }) => (
          <section key={member} className={styles.person}>
            <h2 className={styles.personTitle}>
              <span className={styles.accent}>{member}</span>
              {chores.length ? ' ska för i helvete…' : ' slipper. Just nu.'}
            </h2>
            {chores.length > 0 && (
              <ul className={styles.chores}>
                {chores.map((chore) => (
                  <li key={chore.id} className={styles.chore}>
                    <span className={styles.choreText}>
                      {chore.text}
                      {chore.lastDoneBy && chore.lastDoneAt && (
                        <span className={styles.choreMeta}>
                          Senast gjort av {chore.lastDoneBy},{' '}
                          {relativeTime(chore.lastDoneAt)}
                        </span>
                      )}
                    </span>
                    <span className={styles.choreActions}>
                      <form
                        action={completeChoreAction.bind(null, id, chore.id)}
                      >
                        <button
                          className={`button button-primary ${styles.small}`}
                        >
                          Klart!
                        </button>
                      </form>
                      {household.members.length > 1 && (
                        <form action={passChoreAction.bind(null, id, chore.id)}>
                          <button className={`button ${styles.small}`}>
                            Jag vägrar
                          </button>
                        </form>
                      )}
                      <form action={removeChoreAction.bind(null, id, chore.id)}>
                        <button
                          className={styles.iconButton}
                          aria-label={`Ta bort ${chore.text}`}
                          title="Ta bort"
                        >
                          ✕
                        </button>
                      </form>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Fler sysslor</h2>
        <form
          action={addChoreAction.bind(null, id)}
          className={styles.inlineForm}
        >
          <label htmlFor="new-chore" className="visually-hidden">
            Ny syssla
          </label>
          <input
            id="new-chore"
            name="text"
            className="input"
            placeholder="vattna blommorna"
            maxLength={LIMITS.choreText}
            required
          />
          <button className="button">Lägg till</button>
        </form>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Vilka bor här?</h2>
        <ul className={styles.memberList}>
          {household.members.map((member) => (
            <li key={member}>
              {member}
              {household.members.length > 1 && (
                <form action={removeMemberAction.bind(null, id, member)}>
                  <button
                    className={styles.iconButton}
                    aria-label={`Ta bort ${member}`}
                    title="Ta bort"
                  >
                    ✕
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
        {household.members.length < LIMITS.members && (
          <form
            action={addMemberAction.bind(null, id)}
            className={styles.inlineForm}
          >
            <label htmlFor="new-member" className="visually-hidden">
              Ny person
            </label>
            <input
              id="new-member"
              name="name"
              className="input"
              placeholder="Namn"
              maxLength={LIMITS.memberName}
              required
            />
            <button className="button">Lägg till</button>
          </form>
        )}
      </section>

      <ShareButton
        path={`/lista/${id}`}
        text={`Här är sysslolistan för ${household.name}. Gör din del för i helvete.`}
        label="Dela listan med hushållet"
      />
    </AreaPage>
  );
};

export default HouseholdPage;
