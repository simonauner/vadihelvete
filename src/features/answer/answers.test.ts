import { describe, expect, it } from 'vitest';
import { answers, pickAnswer } from './answers';

describe('pickAnswer', () => {
  it('never repeats the previous answer', () => {
    const previous = answers[0];
    for (let i = 0; i < 50; i++) {
      expect(pickAnswer(previous)).not.toBe(previous);
    }
  });

  it('can reach every answer', () => {
    expect(pickAnswer(undefined, () => 0)).toBe(answers[0]);
    expect(pickAnswer(undefined, () => 0.9999)).toBe(answers.at(-1));
  });
});
