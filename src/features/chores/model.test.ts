import { describe, expect, it } from 'vitest';
import {
  addChore,
  addMember,
  completeTask,
  createHousehold,
  fromStored,
  isAllDone,
  parseWho,
  refuseTask,
  removeChore,
  removeMember,
  resetHousehold,
  undoTask,
  type Household,
  type Make,
} from './model';

const members = ['Kalle', 'Lisa', 'Olle'];

const maker = (): Make => {
  let counter = 0;
  return { id: () => `t${counter++}`, random: () => 0 };
};

const household = (make = maker()) =>
  createHousehold({
    id: 'abc123',
    name: 'Familjen Andersson',
    members,
    chores: [
      { text: 'tvätta', kind: 'everyone' },
      { text: 'badrummet', kind: 'assigned', assignee: 'Kalle' },
      { text: 'dammsuga', kind: 'random' },
      { text: 'diska', kind: 'random' },
    ],
    make,
    now: 0,
  });

const tasksOf = (h: Household, text: string) => {
  const chore = h.chores.find((c) => c.text === text)!;
  return h.tasks.filter((t) => t.choreId === chore.id);
};

const assignees = (h: Household, text: string) =>
  tasksOf(h, text).map((t) => t.assignee);

describe('chores', () => {
  it('gives everyone their own share of "everyone" chores', () => {
    expect(assignees(household(), 'tvätta')).toEqual(members);
  });

  it('gives assigned chores to the one responsible', () => {
    expect(assignees(household(), 'badrummet')).toEqual(['Kalle']);
  });

  it('draws random chores among whoever has the least to do', () => {
    // Kalle already has two tasks, so Lisa and Olle get the random ones.
    const h = household();
    expect([...assignees(h, 'dammsuga'), ...assignees(h, 'diska')]).toEqual([
      'Lisa',
      'Olle',
    ]);
  });

  it('falls back to drawing when the assignee does not live there', () => {
    const h = createHousehold({
      id: 'abc123',
      name: 'x',
      members,
      chores: [{ text: 'badrummet', kind: 'assigned', assignee: 'Bosse' }],
      make: maker(),
      now: 0,
    });
    expect(h.chores[0]).toMatchObject({ kind: 'random' });
    expect(h.chores[0]).not.toHaveProperty('assignee');
  });

  it('marks a task as done by its assignee and can undo it', () => {
    const h = household();
    const [task] = tasksOf(h, 'badrummet');
    const done = completeTask(h, task.id, 1000);

    expect(tasksOf(done, 'badrummet')[0]).toMatchObject({
      doneAt: 1000,
      doneBy: 'Kalle',
      assignee: 'Kalle',
    });
    // Pressing "Klart!" again from a stale page changes nothing.
    expect(completeTask(done, task.id, 2000)).toEqual(done);
    expect(tasksOf(undoTask(done, task.id), 'badrummet')[0].doneAt).toBe(
      undefined
    );
  });

  it('is all done when every task is done', () => {
    let h = household();
    expect(isAllDone(h)).toBe(false);
    for (const task of h.tasks) h = completeTask(h, task.id, 1);
    expect(isAllDone(h)).toBe(true);
  });

  it('hands a refused task to someone else', () => {
    const h = household();
    const kallesLaundry = tasksOf(h, 'tvätta')[0];
    const after = refuseTask(h, kallesLaundry.id, 'Kalle', maker());
    const task = after.tasks.find((t) => t.id === kallesLaundry.id)!;

    expect(task.owner).toBe('Kalle');
    expect(task.assignee).not.toBe('Kalle');
    expect(task.refusedBy).toEqual(['Kalle']);
  });

  it('prefers someone who has not refused already', () => {
    let h = household();
    const [task] = tasksOf(h, 'badrummet');
    h = refuseTask(h, task.id, 'Kalle', maker());
    const second = h.tasks.find((t) => t.id === task.id)!.assignee;
    h = refuseTask(h, task.id, second, maker());
    const third = h.tasks.find((t) => t.id === task.id)!;

    expect(third.assignee).not.toBe('Kalle');
    expect(third.assignee).not.toBe(second);
    expect(third.refusedBy).toEqual(['Kalle', second]);
  });

  it('only lets the current assignee refuse', () => {
    const h = household();
    const [task] = tasksOf(h, 'badrummet');
    expect(refuseTask(h, task.id, 'Lisa', maker())).toBe(h);
  });

  it('adds chores with tasks and removes them with their tasks', () => {
    const make = maker();
    let h = addChore(
      household(make),
      { text: 'handla', kind: 'everyone' },
      make
    );
    expect(assignees(h, 'handla')).toEqual(members);

    h = removeChore(h, h.chores.at(-1)!.id);
    expect(h.chores.map((c) => c.text)).not.toContain('handla');
    expect(h.tasks).toHaveLength(6);
  });

  it('gives new members their share of "everyone" chores', () => {
    const make = maker();
    const h = addMember(household(make), 'Pelle', make);
    expect(assignees(h, 'tvätta')).toEqual([...members, 'Pelle']);
    expect(addMember(h, 'Kalle', make)).toBe(h);
  });

  it('redraws what a removed member had', () => {
    const make = maker();
    const h = removeMember(household(make), 'Kalle', make);

    expect(h.members).toEqual(['Lisa', 'Olle']);
    expect(assignees(h, 'tvätta')).toEqual(['Lisa', 'Olle']);
    expect(h.chores.find((c) => c.text === 'badrummet')).toMatchObject({
      kind: 'random',
    });
    expect(h.tasks.every((t) => t.assignee !== 'Kalle')).toBe(true);
  });

  it('never removes the last member', () => {
    const make = maker();
    let h = household(make);
    h = removeMember(removeMember(h, 'Lisa', make), 'Olle', make);
    expect(removeMember(h, 'Kalle', make).members).toEqual(['Kalle']);
  });

  it('resets to undone tasks without refusals', () => {
    const make = maker();
    let h = household(make);
    const [first, second] = h.tasks;
    h = completeTask(h, first.id, 1);
    h = refuseTask(h, second.id, second.assignee, make);
    h = resetHousehold(h, make);

    expect(h.tasks).toHaveLength(6);
    expect(h.tasks.some((t) => t.doneAt || t.refusedBy.length)).toBe(false);
    expect(assignees(h, 'badrummet')).toEqual(['Kalle']);
  });

  it('turns old rotating lists into assigned chores', () => {
    const h = fromStored({
      id: 'abc123',
      name: 'x',
      members: ['Kalle', 'Lisa'],
      chores: [
        { id: 'a', text: 'diska', turn: 1 },
        { id: 'b', text: 'dammsuga', turn: 2 },
      ],
      createdAt: 0,
    });

    expect(h.chores).toEqual([
      { id: 'a', text: 'diska', kind: 'assigned', assignee: 'Lisa' },
      { id: 'b', text: 'dammsuga', kind: 'assigned', assignee: 'Kalle' },
    ]);
    expect(h.tasks.map((t) => [t.id, t.assignee])).toEqual([
      ['a', 'Lisa'],
      ['b', 'Kalle'],
    ]);
  });

  it('parses the "vem?" select', () => {
    expect(parseWho('alla', members)).toEqual({ kind: 'everyone' });
    expect(parseWho('person:Lisa', members)).toEqual({
      kind: 'assigned',
      assignee: 'Lisa',
    });
    expect(parseWho('person:Bosse', members)).toEqual({ kind: 'random' });
    expect(parseWho(null, members)).toEqual({ kind: 'random' });
  });
});
