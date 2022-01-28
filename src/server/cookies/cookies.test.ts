import { getSeenSuggestions } from './cookies';

describe('getSeenSuggestions', () => {
  it('should return values', () => {
    // align

    // act
    const result = getSeenSuggestions({
      data: JSON.stringify({ seenSuggestions: { home: [1], it: [7, 9] } }),
    });

    // assert
    expect(result.home).toEqual([1]);
    expect(result.it).toEqual([7, 9]);
  });

  it('should handle empty suggestions', () => {
    // align

    // act
    const result = getSeenSuggestions({
      data: JSON.stringify({ seenSuggestions: {} }),
    });

    // assert
    expect(result.home).toBeUndefined();
  });

  it('should handle empty data', () => {
    // align

    // act
    const result = getSeenSuggestions({});

    // assert
    expect(result.home).toBeUndefined();
  });
});
