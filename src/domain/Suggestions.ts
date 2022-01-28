export type Suggestions = {
  home: string[];
  it: string[];
};
export type SuggestionCategories = keyof Suggestions;

export type SeenSuggestions = Partial<Record<SuggestionCategories, number[]>>;
