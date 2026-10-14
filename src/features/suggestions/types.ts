export type SuggestionCategory = 'hemma' | 'it';

export type SeenSuggestions = Partial<Record<SuggestionCategory, number[]>>;

export type Suggestion = {
  index: number;
  text: string;
};
