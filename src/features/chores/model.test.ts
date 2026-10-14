import { describe, expect, it } from 'vitest';
import {
  addChore,
  addMember,
  completeChore,
  createHousehold,
  passChore,
  removeMember,
  whoseTurn,
} from './model';

let counter = 0;
const household = () =>
  createHousehold({
    id: 'abc123',
    name: 'Familjen Andersson',
    members: ['Kalle', 'Lisa', 'Olle'],
    chores: ['dammsuga', 'diska', 'tvätta', 'handla'],
    choreId: () => `c${counter++}`,
    now: 0,
  });

describe('chores', () => {
  it('spreads the first turns across members', () => {
    const h = household();
    expect(h.chores.map((c) => whoseTurn(h, c))).toEqual([
      'Kalle',
      'Lisa',
      'Olle',
      'Kalle',
    ]);
  });

  it('rotates to the next person when a chore is done', () => {
    const h = household();
    const [first] = h.chores;
    const after = completeChore(h, first.id, 1000);
    const chore = after.chores[0];

    expect(chore.lastDoneBy).toBe('Kalle');
    expect(chore.lastDoneAt).toBe(1000);
    expect(whoseTurn(after, chore)).toBe('Lisa');
  });

  it('wraps around after the last member', () => {
    const h = household();
    const third = h.chores[2];
    expect(whoseTurn(h, passChore(h, third.id).chores[2])).toBe('Kalle');
  });

  it('keeps turns sensible when a member is removed', () => {
    const h = household();
    const after = removeMember(h, 'Lisa');

    expect(after.members).toEqual(['Kalle', 'Olle']);
    // Lisa's chore passes to the next person in line, Olle.
    expect(after.chores.map((c) => whoseTurn(after, c))).toEqual([
      'Kalle',
      'Olle',
      'Olle',
      'Kalle',
    ]);
  });

  it('never removes the last member', () => {
    let h = household();
    h = removeMember(removeMember(h, 'Lisa'), 'Olle');
    expect(removeMember(h, 'Kalle').members).toEqual(['Kalle']);
  });

  it('ignores duplicate members and adds chores', () => {
    const h = addMember(household(), 'Kalle');
    expect(h.members).toHaveLength(3);
    expect(addChore(h, 'vattna blommor', 'new').chores).toHaveLength(5);
  });
});
