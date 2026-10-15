import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AreaPage } from '@/components/AreaPage';
import { ShareButton } from '@/components/ShareButton';
import {
  addChoreAction,
  addMemberAction,
  completeTaskAction,
  refuseTaskAction,
  removeChoreAction,
  removeMemberAction,
  resetAction,
  undoTaskAction,
} from '@/features/chores/actions';
import { Confetti } from '@/features/chores/Confetti';
import styles from '@/features/chores/Chores.module.css';
import {
  isAllDone,
  LIMITS,
  type Chore,
  type Household,
  type Task,
} from '@/features/chores/model';
import { WhoSelect } from '@/features/chores/WhoSelect';
import { loadHousehold } from '@/features/chores/store';
import { emojiIcon } from '@/lib/emojiIcon';
import { relativeTime } from '@/lib/relativeTime';
import { StoreMissing } from '@/lib/StoreMissing';
import { isId, isStoreConfigured } from '@/lib/store';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ klara?: string }>;
};

export const metadata: Metadata = {
  title: 'Vem i helvete ska göra vad?',
  description: 'Vår sysslolista. Kolla vad du ska göra för i helvete.',
  icons: { icon: emojiIcon('🧽') },
  robots: { index: false },
};

const KIND_LABEL: Record<Chore['kind'], string> = {
  everyone: '👥 alla gör sin',
  assigned: '📌 ansvarig',
  random: '🎲 lottad',
};

const and = new Intl.ListFormat('sv', { type: 'conjunction' });

/** "Kalles", "Lars" */
const genitive = (name: string) => (/[sxz]$/i.test(name) ? name : `${name}s`);

const whoLabel = (chore: Chore) =>
  chore.kind === 'assigned' ? `📌 ${chore.assignee}` : KIND_LABEL[chore.kind];

const refusalNote = (task: Task, chore: Chore) => {
  if (!task.refusedBy.length) return null;
  const whose =
    chore.kind === 'everyone' && task.owner !== task.assignee
      ? `Egentligen ${genitive(task.owner)}. `
      : '';
  return `${whose}${and.format(task.refusedBy)} vägrade, så nu är den din.`;
};

const TaskItem = ({
  household,
  task,
  chore,
}: {
  household: Household;
  task: Task;
  chore: Chore;
}) => {
  const { id } = household;
  const note = refusalNote(task, chore);

  if (task.doneAt) {
    return (
      <li className={`${styles.chore} ${styles.done}`}>
        <span className={styles.check} aria-hidden>
          ✓
        </span>
        <span className={styles.choreText}>
          <span className={styles.doneText}>{chore.text}</span>
          <span className={styles.doneMeta}>
            {task.doneBy} fixade det {relativeTime(task.doneAt)}
          </span>
        </span>
        <form action={undoTaskAction.bind(null, id, task.id)}>
          <button className={styles.textButton}>Ångra</button>
        </form>
      </li>
    );
  }

  return (
    <li className={styles.chore}>
      <span className={styles.ring} aria-hidden />
      <span className={styles.choreText}>
        {chore.text}
        <span className={styles.choreMeta}>
          <span className={styles.kind}>{KIND_LABEL[chore.kind]}</span>
          {note && <span className={styles.refused}>{note}</span>}
        </span>
      </span>
      <span className={styles.choreActions}>
        <form action={completeTaskAction.bind(null, id, task.id)}>
          <button className={`button button-primary ${styles.small}`}>
            Klart!
          </button>
        </form>
        {household.members.length > 1 && (
          <form
            action={refuseTaskAction.bind(null, id, task.id, task.assignee)}
          >
            <button className={`button ${styles.small}`}>Jag vägrar</button>
          </form>
        )}
      </span>
    </li>
  );
};

const personTitle = (open: number, total: number) => {
  if (!total) return ' slipper. Just nu.';
  if (!open) return ' är klar. Bra jobbat för i helvete.';
  return ' ska för i helvete…';
};

const HouseholdPage = async ({ params, searchParams }: Props) => {
  if (!isStoreConfigured()) return <StoreMissing />;

  const { id } = await params;
  const household = isId(id) ? await loadHousehold(id) : null;
  if (!household) notFound();

  const hideDone = (await searchParams).klara === 'dolda';
  const choreById = new Map(household.chores.map((c) => [c.id, c]));
  const tasks = household.tasks.filter((task) => choreById.has(task.choreId));
  const doneCount = tasks.filter((task) => task.doneAt).length;
  const allDone = isAllDone(household);

  const byMember = household.members.map((member) => {
    const mine = tasks.filter((task) => task.assignee === member);
    return {
      member,
      total: mine.length,
      open: mine.filter((task) => !task.doneAt).length,
      shown: hideDone ? mine.filter((task) => !task.doneAt) : mine,
    };
  });

  return (
    <AreaPage
      title={
        <>
          Vem i helvete ska göra vad hos{' '}
          <span className={styles.accent}>{household.name}</span>?
        </>
      }
    >
      {tasks.length > 0 && (
        <div className={styles.progress}>
          <div className={styles.progressText}>
            <strong>
              {doneCount} av {tasks.length} klara
            </strong>
            {doneCount > 0 && (
              <Link
                href={hideDone ? `/lista/${id}` : `/lista/${id}?klara=dolda`}
                className={styles.textButton}
                scroll={false}
                replace
              >
                {hideDone ? `Visa klara (${doneCount})` : 'Dölj klara'}
              </Link>
            )}
          </div>
          <div
            className={styles.progressBar}
            role="progressbar"
            aria-label="Klara sysslor"
            aria-valuemin={0}
            aria-valuemax={tasks.length}
            aria-valuenow={doneCount}
          >
            <span style={{ width: `${(doneCount / tasks.length) * 100}%` }} />
          </div>
        </div>
      )}

      {allDone && <Confetti />}
      {allDone && (
        <section className={styles.celebration}>
          <h2 className={styles.celebrationTitle}>
            Allt är gjort. Vad i helvete, vad duktiga ni är!
          </h2>
          <form action={resetAction.bind(null, id)}>
            <button className="button button-primary">
              Börja om med samma lista
            </button>
          </form>
        </section>
      )}

      <div className={styles.people}>
        {byMember.map(({ member, total, open, shown }) => (
          <section key={member} className={styles.person}>
            <h2 className={styles.personTitle}>
              <span className={styles.accent}>{member}</span>
              {personTitle(open, total)}
              {total > 0 && (
                <span className={styles.personCount}>
                  {total - open}/{total}
                </span>
              )}
            </h2>
            {shown.length > 0 && (
              <ul className={styles.chores}>
                {shown.map((task) => (
                  <TaskItem
                    key={task.id}
                    household={household}
                    task={task}
                    chore={choreById.get(task.choreId)!}
                  />
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sysslorna</h2>
        <p className={styles.hint}>
          Det här är listan ni börjar om med. Lottade sysslor lottas om varje
          gång.
        </p>
        <ul className={styles.choreList}>
          {household.chores.map((chore) => (
            <li key={chore.id}>
              <span className={styles.choreListText}>{chore.text}</span>
              <span className={styles.kind}>{whoLabel(chore)}</span>
              <form action={removeChoreAction.bind(null, id, chore.id)}>
                <button
                  className={styles.iconButton}
                  aria-label={`Ta bort ${chore.text}`}
                  title="Ta bort"
                >
                  ✕
                </button>
              </form>
            </li>
          ))}
        </ul>
        {household.chores.length < LIMITS.chores && (
          <form
            action={addChoreAction.bind(null, id)}
            className={`${styles.inlineForm} ${styles.addChore}`}
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
            <WhoSelect
              members={household.members}
              aria-label="Vem ska göra den?"
              defaultValue="slumpa"
            />
            <button className="button">Lägg till</button>
          </form>
        )}
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

      {!allDone && tasks.length > 0 && (
        <section className={styles.section}>
          <details className={styles.reset}>
            <summary>Börja om från början</summary>
            <p className={styles.hint}>
              Allt blir ogjort igen, vägranden glöms bort och de lottade
              sysslorna lottas om.
            </p>
            <form action={resetAction.bind(null, id)}>
              <button className={`button ${styles.small}`}>Ja, börja om</button>
            </form>
          </details>
        </section>
      )}

      <ShareButton
        path={`/lista/${id}`}
        text={`Här är sysslolistan för ${household.name}. Gör din del för i helvete.`}
        label="Dela listan med hushållet"
      />
    </AreaPage>
  );
};

export default HouseholdPage;
