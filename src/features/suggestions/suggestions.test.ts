import { describe, expect, it } from 'vitest';
import {
  markSeen,
  parseSeen,
  pickSuggestion,
  suggestionByNumber,
  suggestions,
} from './suggestions';

describe('parseSeen', () => {
  it('returns seen indexes per category', () => {
    expect(parseSeen(JSON.stringify({ hemma: [1], it: [7, 8] }))).toEqual({
      hemma: [1],
      it: [7, 8],
    });
  });

  it('handles a missing cookie', () => {
    expect(parseSeen(undefined)).toEqual({});
  });

  it('ignores a malformed cookie', () => {
    expect(parseSeen('not json')).toEqual({});
  });

  it('drops unknown categories and bad values', () => {
    expect(
      parseSeen(JSON.stringify({ hemma: ['x'], it: [2], hack: [1] }))
    ).toEqual({ it: [2] });
  });
});

describe('pickSuggestion', () => {
  it('never picks a seen suggestion', () => {
    const allButLast = suggestions.it.map((_, index) => index).slice(0, -1);
    const picked = pickSuggestion('it', { it: allButLast });

    expect(picked?.index).toBe(suggestions.it.length - 1);
  });

  it('returns undefined when everything is seen', () => {
    const all = suggestions.hemma.map((_, index) => index);

    expect(pickSuggestion('hemma', { hemma: all })).toBeUndefined();
  });

  it('can pick the first and the last suggestion', () => {
    expect(pickSuggestion('it', {}, () => 0)?.index).toBe(0);
    expect(pickSuggestion('it', {}, () => 0.9999)?.index).toBe(
      suggestions.it.length - 1
    );
  });
});

describe('markSeen', () => {
  it('adds an index once', () => {
    expect(markSeen(markSeen({}, 'it', 3), 'it', 3)).toEqual({ it: [3] });
  });
});

describe('suggestionByNumber', () => {
  it('maps 1-based numbers to suggestions', () => {
    expect(suggestionByNumber('hemma', '1')).toEqual({
      index: 0,
      text: suggestions.hemma[0],
    });
  });

  it('rejects numbers out of range or malformed', () => {
    expect(suggestionByNumber('hemma', '0')).toBeUndefined();
    expect(suggestionByNumber('hemma', '999')).toBeUndefined();
    expect(suggestionByNumber('hemma', '1e1')).toBeUndefined();
    expect(suggestionByNumber('hemma', 'constructor')).toBeUndefined();
  });
});
