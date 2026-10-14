export type Chore = {
  id: string;
  text: string;
  /** Index into members of whose turn it is. */
  turn: number;
  lastDoneAt?: number;
  lastDoneBy?: string;
};

export type Household = {
  id: string;
  name: string;
  members: string[];
  chores: Chore[];
  createdAt: number;
};

export const LIMITS = {
  name: 40,
  members: 10,
  memberName: 30,
  chores: 40,
  choreText: 80,
};

export const whoseTurn = (household: Household, chore: Chore) =>
  household.members[chore.turn % household.members.length];

export const createHousehold = ({
  id,
  name,
  members,
  chores,
  choreId,
  now,
}: {
  id: string;
  name: string;
  members: string[];
  chores: string[];
  choreId: () => string;
  now: number;
}): Household => ({
  id,
  name,
  members,
  // Stagger the first turns so not everything lands on the same person.
  chores: chores.map((text, index) => ({
    id: choreId(),
    text,
    turn: index % members.length,
  })),
  createdAt: now,
});

const updateChore = (
  household: Household,
  choreId: string,
  update: (chore: Chore) => Chore
): Household => ({
  ...household,
  chores: household.chores.map((chore) =>
    chore.id === choreId ? update(chore) : chore
  ),
});

const nextTurn = (household: Household, chore: Chore) =>
  (chore.turn + 1) % household.members.length;

export const completeChore = (
  household: Household,
  choreId: string,
  now: number
) =>
  updateChore(household, choreId, (chore) => ({
    ...chore,
    lastDoneAt: now,
    lastDoneBy: whoseTurn(household, chore),
    turn: nextTurn(household, chore),
  }));

/** "Jag vägrar": hand the chore to the next person without doing it. */
export const passChore = (household: Household, choreId: string) =>
  updateChore(household, choreId, (chore) => ({
    ...chore,
    turn: nextTurn(household, chore),
  }));

export const addChore = (
  household: Household,
  text: string,
  id: string
): Household =>
  household.chores.length >= LIMITS.chores
    ? household
    : {
        ...household,
        chores: [
          ...household.chores,
          {
            id,
            text,
            turn: household.chores.length % household.members.length,
          },
        ],
      };

export const removeChore = (household: Household, choreId: string) => ({
  ...household,
  chores: household.chores.filter((chore) => chore.id !== choreId),
});

export const addMember = (household: Household, name: string): Household =>
  household.members.length >= LIMITS.members || household.members.includes(name)
    ? household
    : { ...household, members: [...household.members, name] };

export const removeMember = (household: Household, name: string): Household => {
  const index = household.members.indexOf(name);
  if (index === -1 || household.members.length <= 1) return household;

  const members = household.members.filter((member) => member !== name);

  return {
    ...household,
    members,
    chores: household.chores.map((chore) => {
      const turn = chore.turn % household.members.length;
      // Whoever came after the removed member keeps their turn.
      const shifted = turn > index ? turn - 1 : turn;
      return { ...chore, turn: shifted % members.length };
    }),
  };
};
