import { describe, expect, it } from 'vitest';
import { addOption, decide, reset, vote, type Room } from './model';

const room = (): Room => ({
  id: 'room123',
  question: 'Vad i helvete ska vi äta?',
  options: [
    { id: 'a', text: 'Tacos', voters: [] },
    { id: 'b', text: 'Pizza', voters: [] },
    { id: 'c', text: 'Sushi', voters: [] },
  ],
  createdAt: 0,
});

const votes = (r: Room) => r.options.map((o) => o.voters.length);

describe('vote', () => {
  it('gives each voter one vote and moves it when they change their mind', () => {
    let r = vote(room(), 'a', 'kalle');
    r = vote(r, 'b', 'kalle');
    expect(votes(r)).toEqual([0, 1, 0]);
  });

  it('takes the vote back when clicking the same option again', () => {
    const r = vote(vote(room(), 'a', 'kalle'), 'a', 'kalle');
    expect(votes(r)).toEqual([0, 0, 0]);
  });
});

describe('decide', () => {
  it('picks the option with most votes', () => {
    let r = vote(room(), 'c', 'kalle');
    r = vote(r, 'c', 'lisa');
    r = vote(r, 'a', 'olle');
    expect(decide(r, 1).decision).toEqual({
      optionId: 'c',
      at: 1,
      byVotes: true,
    });
  });

  it('breaks ties randomly among the leaders only', () => {
    let r = vote(room(), 'a', 'kalle');
    r = vote(r, 'b', 'lisa');
    expect(decide(r, 1, () => 0).decision?.optionId).toBe('a');
    expect(decide(r, 1, () => 0.99).decision?.optionId).toBe('b');
  });

  it('picks at random when nobody voted', () => {
    expect(decide(room(), 1, () => 0.99).decision).toMatchObject({
      optionId: 'c',
      byVotes: false,
    });
  });
});

describe('reset and addOption', () => {
  it('clears votes and the decision', () => {
    const r = reset(decide(vote(room(), 'a', 'kalle'), 1));
    expect(r.decision).toBeUndefined();
    expect(votes(r)).toEqual([0, 0, 0]);
  });

  it('ignores duplicate options', () => {
    expect(addOption(room(), 'tacos', 'd').options).toHaveLength(3);
    expect(addOption(room(), 'Kebab', 'd').options).toHaveLength(4);
  });
});
