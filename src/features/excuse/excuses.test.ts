import { describe, expect, it } from 'vitest';
import { excuseByCode, randomExcuse } from './excuses';

describe('excuses', () => {
  it('builds an excuse from three parts', () => {
    expect(randomExcuse(() => 0)).toEqual({
      code: '1-1-1',
      text: 'Förlåt att jag kom sent, men en älg blockerade E4:an. Det kommer inte hända igen. Förmodligen.',
    });
  });

  it('round-trips codes', () => {
    const excuse = randomExcuse(() => 0.999);
    expect(excuseByCode(excuse.code)).toEqual(excuse);
  });

  it('rejects bad codes', () => {
    expect(excuseByCode('0-1-1')).toBeUndefined();
    expect(excuseByCode('99-1-1')).toBeUndefined();
    expect(excuseByCode('1-1')).toBeUndefined();
    expect(excuseByCode('a-b-c')).toBeUndefined();
  });
});
