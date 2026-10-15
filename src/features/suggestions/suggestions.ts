import type { SeenSuggestions, Suggestion, SuggestionCategory } from './types';

export const categories: Record<
  SuggestionCategory,
  { title: string; emoji: string }
> = {
  hemma: { title: 'Vad i helvete ska jag göra hemma?', emoji: '🧹' },
  it: { title: 'Vad i helvete ska jag koda?', emoji: '🖥️' },
};

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
    'byta lakan',
    'bädda sängen',
    'vattna blommorna innan de dör',
    'frosta av frysen',
    'rensa ur kylen och slänga det som lever',
    'panta burkarna',
    'åka till återvinningen',
    'byta glödlampan i hallen',
    'rensa avloppet i duschen',
    'putsa fönstren',
    'damma ovanpå köksskåpen',
    'tömma dammsugaren',
    'svara på mejlet från bostadsrättsföreningen',
    'betala räkningarna',
    'skura golvet',
    'laga kranen som droppar',
    'skruva ihop IKEA-möbeln som stått i kartongen sen i våras',
    'rensa i garderoben',
    'baka bullar',
    'byta batteri i brandvarnaren',
    'avkalka kaffebryggaren',
    'planera veckans middagar',
    'slänga pizzakartongerna',
    'skaka mattorna',
    'göra rent fläktfiltret i köket',
    'stryka skjortorna',
    'göra rent mikron',
    'boka tvättstugan',
    'rensa luddfiltret i torktumlaren',
    'sätta upp tavlan som stått lutad mot väggen i två år',
    'lämna tillbaka grejerna du lånat av grannen',
    'bära ner skräpet till förrådet',
    'ringa din mamma',
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
    'ta bort alla console.log du glömt kvar',
    'uppdatera beroendena',
    'läsa felmeddelandet innan du googlar det',
    'skriva dokumentation som någon faktiskt kan läsa',
    'stänga några av dina 47 öppna flikar',
    'lära dig git rebase utan att få panik',
    'radera brancherna som mergades 2019',
    'fixa det flakiga testet i stället för att köra om bygget',
    'lära dig kortkommandona i din editor',
    'ta bort den utkommenterade koden',
    'döpa variablerna till något annat än data och temp',
    'lära dig regex på riktigt',
    'sätta upp en linter och faktiskt lyssna på den',
    'granska kollegans PR som väntat sen i måndags',
    'skriva en README',
    'ta tag i alla TODO-kommentarer',
    'ta en backup',
    'testa att återställa din backup',
    'lära dig avsluta vim',
    'byta lösenord från password123',
    'sluta pusha direkt till main',
    'göra CI-bygget snabbare',
    'lägga till lite felhantering',
    'förstå koden som AI:n skrev åt dig',
    'slå på tvåfaktorsinloggning',
    'lära dig ett nytt programmeringsspråk',
    'rensa bort feature-flaggorna som varit på i ett år',
    'mäta innan du optimerar',
    'fundera på om det verkligen behöver vara en mikrotjänst',
    'koda något helt i onödan bara för att det är kul',
    'stänga datorn och gå ut',
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

/** Shared links use 1-based numbers: /hemma/1 is the first suggestion. */
export const suggestionByNumber = (
  category: SuggestionCategory,
  nr: string
): Suggestion | undefined => {
  if (!/^\d+$/.test(nr)) return undefined;

  const index = Number(nr) - 1;
  const text = suggestions[category][index];

  return text ? { index, text } : undefined;
};
