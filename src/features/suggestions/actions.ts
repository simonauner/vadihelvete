'use server';

import { getSeen, setSeen } from './seen';
import { isSuggestionCategory, markSeen, suggestions } from './suggestions';

export const markDone = async (category: unknown, index: unknown) => {
  if (
    !isSuggestionCategory(category) ||
    !Number.isInteger(index) ||
    (index as number) < 0 ||
    (index as number) >= suggestions[category].length
  ) {
    return;
  }

  await setSeen(markSeen(await getSeen(), category, index as number));
};

export const startOver = async (category: unknown) => {
  if (!isSuggestionCategory(category)) return;

  const seen = await getSeen();
  await setSeen({ ...seen, [category]: [] });
};
