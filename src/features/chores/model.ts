/**
 * - everyone: every member does their own (alla tar hand om sin tvätt)
 * - assigned: one named member is responsible (Kalle städar badrummet)
 * - random: anyone can do it, so it is drawn when the list starts
 */
export type ChoreKind = 'everyone' | 'assigned' | 'random';

/** What the list was set up with. Resetting rebuilds the tasks from these. */
export type Chore = {
  id: string;
  text: string;
  kind: ChoreKind;
  /** Who is responsible, for kind "assigned". */
  assignee?: string;
};

/** One person's share of a chore. "everyone" chores get one task per member. */
export type Task = {
  id: string;
  choreId: string;
  /** Whose task it was from the start. */
  owner: string;
  /** Whose task it is now. Differs from owner once someone refused. */
  assignee: string;
  refusedBy: string[];
  doneAt?: number;
  doneBy?: string;
};

export type Household = {
  version: 2;
  id: string;
  name: string;
  members: string[];
  chores: Chore[];
  tasks: Task[];
  createdAt: number;
};

/** Before chores had kinds, every chore rotated between the members. */
type LegacyHousehold = {
  id: string;
  name: string;
  members: string[];
  chores: { id: string; text: string; turn: number }[];
  createdAt: number;
};

export type StoredHousehold = Household | LegacyHousehold;

/** Where new ids and dice rolls come from, so tests can control them. */
export type Make = { id: () => string; random: () => number };

export type ChoreInput = Pick<Chore, 'text' | 'kind' | 'assignee'>;

export const LIMITS = {
  name: 40,
  members: 10,
  memberName: 30,
  chores: 40,
  choreText: 80,
};

/** The value of the "vem?" select: "alla", "slumpa" or "person:Kalle". */
export const whoValue = ({ kind, assignee }: Omit<ChoreInput, 'text'>) =>
  kind === 'assigned'
    ? `person:${assignee}`
    : kind === 'everyone'
      ? 'alla'
      : 'slumpa';

export const parseWho = (
  value: unknown,
  members: string[]
): Omit<ChoreInput, 'text'> => {
  const who = String(value ?? '');
  if (who === 'alla') return { kind: 'everyone' };

  const assignee = who.startsWith('person:') ? who.slice(7) : '';
  if (members.includes(assignee)) return { kind: 'assigned', assignee };

  return { kind: 'random' };
};

const pick = <T>(list: T[], random: () => number) =>
  list[Math.floor(random() * list.length) % list.length];

const openLoad = (tasks: Task[], members: string[]) => {
  const load = new Map(members.map((member) => [member, 0]));
  for (const task of tasks) {
    if (!task.doneAt && load.has(task.assignee)) {
      load.set(task.assignee, load.get(task.assignee)! + 1);
    }
  }
  return load;
};

/** A random member among those with the least to do, so the draw stays fair. */
const pickFairly = (
  candidates: string[],
  load: Map<string, number>,
  random: () => number
) => {
  const least = Math.min(...candidates.map((m) => load.get(m) ?? 0));
  return pick(
    candidates.filter((m) => (load.get(m) ?? 0) === least),
    random
  );
};

const newTask = (choreId: string, member: string, make: Make): Task => ({
  id: make.id(),
  choreId,
  owner: member,
  assignee: member,
  refusedBy: [],
});

const fixedMembers = (chore: Chore, members: string[]) => {
  if (chore.kind === 'everyone') return members;
  if (chore.kind === 'assigned' && chore.assignee) {
    if (members.includes(chore.assignee)) return [chore.assignee];
  }
  return null;
};

/** Fresh, undone tasks for the chores. Random chores go last so they even out the rest. */
const buildTasks = (
  chores: Chore[],
  members: string[],
  make: Make,
  existing: Task[] = []
) => {
  const fixed = chores.map((chore) => fixedMembers(chore, members));
  const load = openLoad(existing, members);
  for (const assigned of fixed) {
    for (const member of assigned ?? []) {
      load.set(member, load.get(member)! + 1);
    }
  }

  const drawn = chores.map((_, index) => {
    if (fixed[index]) return fixed[index];
    const member = pickFairly(members, load, make.random);
    load.set(member, load.get(member)! + 1);
    return [member];
  });

  return chores.flatMap((chore, index) =>
    drawn[index].map((member) => newTask(chore.id, member, make))
  );
};

export const createHousehold = ({
  id,
  name,
  members,
  chores,
  make,
  now,
}: {
  id: string;
  name: string;
  members: string[];
  chores: ChoreInput[];
  make: Make;
  now: number;
}): Household => {
  const choreList = chores.map((chore) => ({
    id: make.id(),
    ...normalizeChore(chore, members),
  }));

  return {
    version: 2,
    id,
    name,
    members,
    chores: choreList,
    tasks: buildTasks(choreList, members, make),
    createdAt: now,
  };
};

const normalizeChore = (
  { text, kind, assignee }: ChoreInput,
  members: string[]
): ChoreInput =>
  kind === 'assigned' && assignee && members.includes(assignee)
    ? { text, kind, assignee }
    : { text, kind: kind === 'everyone' ? 'everyone' : 'random' };

/** Old lists rotated a turn per chore: whoever had the turn becomes responsible. */
export const fromStored = (stored: StoredHousehold): Household => {
  if ('version' in stored && stored.version === 2) return stored;

  const legacy = stored as LegacyHousehold;
  const assigneeOf = (turn: number) =>
    legacy.members[turn % legacy.members.length];

  return {
    version: 2,
    id: legacy.id,
    name: legacy.name,
    members: legacy.members,
    chores: legacy.chores.map(({ id, text, turn }) => ({
      id,
      text,
      kind: 'assigned',
      assignee: assigneeOf(turn),
    })),
    // Reuse the chore id so the ids stay stable until the list is saved.
    tasks: legacy.chores.map(({ id, turn }) => ({
      id,
      choreId: id,
      owner: assigneeOf(turn),
      assignee: assigneeOf(turn),
      refusedBy: [],
    })),
    createdAt: legacy.createdAt,
  };
};

const updateTask = (
  household: Household,
  taskId: string,
  update: (task: Task) => Task
): Household => ({
  ...household,
  tasks: household.tasks.map((task) =>
    task.id === taskId ? update(task) : task
  ),
});

export const completeTask = (
  household: Household,
  taskId: string,
  now: number
) =>
  updateTask(household, taskId, (task) =>
    task.doneAt ? task : { ...task, doneAt: now, doneBy: task.assignee }
  );

export const undoTask = (household: Household, taskId: string) =>
  updateTask(household, taskId, (task) => ({
    ...task,
    doneAt: undefined,
    doneBy: undefined,
  }));

/**
 * "Jag vägrar": hand the task to someone else, preferably someone who has not
 * already refused it. Only the current assignee can refuse, so a stale page
 * cannot pass it along twice.
 */
export const refuseTask = (
  household: Household,
  taskId: string,
  by: string,
  make: Make
) => {
  const task = household.tasks.find((t) => t.id === taskId);
  if (!task || task.doneAt || task.assignee !== by) return household;

  const others = household.members.filter((member) => member !== by);
  if (!others.length) return household;

  const willing = others.filter((member) => !task.refusedBy.includes(member));
  const assignee = pickFairly(
    willing.length ? willing : others,
    openLoad(household.tasks, household.members),
    make.random
  );

  return updateTask(household, taskId, (t) => ({
    ...t,
    assignee,
    refusedBy: [...t.refusedBy.filter((m) => m !== by), by],
  }));
};

export const addChore = (
  household: Household,
  chore: ChoreInput,
  make: Make
): Household => {
  if (household.chores.length >= LIMITS.chores) return household;

  const added = { id: make.id(), ...normalizeChore(chore, household.members) };

  return {
    ...household,
    chores: [...household.chores, added],
    tasks: [
      ...household.tasks,
      ...buildTasks([added], household.members, make, household.tasks),
    ],
  };
};

export const removeChore = (household: Household, choreId: string) => ({
  ...household,
  chores: household.chores.filter((chore) => chore.id !== choreId),
  tasks: household.tasks.filter((task) => task.choreId !== choreId),
});

export const addMember = (
  household: Household,
  name: string,
  make: Make
): Household => {
  if (
    household.members.length >= LIMITS.members ||
    household.members.includes(name)
  ) {
    return household;
  }

  return {
    ...household,
    members: [...household.members, name],
    tasks: [
      ...household.tasks,
      ...household.chores
        .filter((chore) => chore.kind === 'everyone')
        .map((chore) => newTask(chore.id, name, make)),
    ],
  };
};

/** Their own share of "everyone" chores goes away; everything else they had is redrawn. */
export const removeMember = (
  household: Household,
  name: string,
  make: Make
): Household => {
  if (!household.members.includes(name) || household.members.length <= 1) {
    return household;
  }

  const members = household.members.filter((member) => member !== name);
  const kindOf = new Map(household.chores.map((c) => [c.id, c.kind]));
  const tasks = household.tasks.filter(
    (task) => !(task.owner === name && kindOf.get(task.choreId) === 'everyone')
  );
  const load = openLoad(tasks, members);

  return {
    ...household,
    members,
    chores: household.chores.map((chore) =>
      chore.kind === 'assigned' && chore.assignee === name
        ? { id: chore.id, text: chore.text, kind: 'random' }
        : chore
    ),
    tasks: tasks.map((task) => {
      if (task.assignee !== name) return task;
      const assignee = pickFairly(members, load, make.random);
      if (!task.doneAt) load.set(assignee, load.get(assignee)! + 1);
      return {
        ...task,
        owner: task.owner === name ? assignee : task.owner,
        assignee,
      };
    }),
  };
};

/** Back to how it started: nothing done, nothing refused, random chores drawn again. */
export const resetHousehold = (household: Household, make: Make) => ({
  ...household,
  tasks: buildTasks(household.chores, household.members, make),
});

export const isAllDone = (household: Household) =>
  household.tasks.length > 0 && household.tasks.every((task) => task.doneAt);
