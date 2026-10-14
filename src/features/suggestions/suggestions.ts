import type { SeenSuggestions, Suggestion, SuggestionCategory } from './types';

export const suggestions: Record<SuggestionCategory, readonly string[]> = {
  hemma: [
    'städa ditt rum',
    'fylla på diskmaskinen',
    'göra rent i köket',
    'plocka ur diskmaskinen',
    'sätta igång en tvätt',
    'vika tvätt',
    'hänga upp tvätt',
    'göra rent i badrummet',
    'laga middag',
    'göra rent kattlådan',
    'gå ut med soporna',
    'dammsuga',
    'åka och handla mat',
  ],
  it: [
    'refaktorera den där gamla skitkoden',
    'skriva lite mer tester',
    'lära dig skriva bättre commit-meddelanden',
    'skriva lite bättre tester',
    'lära dig skriva bättre PR:s',
    'lära dig hur koden deployas till prod',
    'lära dig använda terminalen',
    'byta till ett riktigt operativsystem',
    'göra koden läsbar',
  ],
};

export const isSuggestionCategory = (
  value: unknown
): value is SuggestionCategory =>
  typeof value === 'string' && Object.hasOwn(suggestions, value);

export const pickSuggestion = (
  category: SuggestionCategory,
  seen: SeenSuggestions,
  random: () => number = Math.random
): Suggestion | undefined => {
  const seenInCategory = new Set(seen[category] ?? []);
  const remaining = suggestions[category]
    .map((text, index) => ({ text, index }))
    .filter(({ index }) => !seenInCategory.has(index));

  if (!remaining.length) return undefined;

  return remaining[Math.floor(random() * remaining.length)];
};

export const markSeen = (
  seen: SeenSuggestions,
  category: SuggestionCategory,
  index: number
): SeenSuggestions => ({
  ...seen,
  [category]: [...new Set([...(seen[category] ?? []), index])],
});

export const parseSeen = (value: string | undefined): SeenSuggestions => {
  if (!value) return {};

  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object') return {};

    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([category, indexes]) =>
          isSuggestionCategory(category) &&
          Array.isArray(indexes) &&
          indexes.every(Number.isInteger)
      )
    );
  } catch {
    return {};
  }
};
