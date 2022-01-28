import { logger } from '../server/logger';
import {
  SeenSuggestions,
  SuggestionCategories,
  Suggestions,
} from '../domain/Suggestions';

const collection: Suggestions = {
  home: [
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

export const getSuggestion = (
  category: SuggestionCategories = 'home',
  seenSuggestions: SeenSuggestions
): [suggestion: string, seenSuggestions: SeenSuggestions] => {
  if (seenSuggestions[category]?.length) {
    logger.debug('user has seen some suggestions', seenSuggestions[category]);
  } else {
    logger.debug('user hasnt seen any suggestions');
  }

  const remainingSuggestions = collection[category].filter(
    (_, index) => !seenSuggestions[category]?.includes(index)
  );

  if (!remainingSuggestions?.length) {
    logger.debug('no remaining suggestions to deliver!');
  } else {
    logger.debug('user has these remaining suggestions', remainingSuggestions);
  }

  const index = Math.round(Math.random() * (remainingSuggestions.length - 1));
  const suggestion = remainingSuggestions[index];

  const originalIndex = collection[category].findIndex(
    (value) => value === suggestion
  );

  logger.debug(`returning suggestion: "${suggestion}"`);
  logger.debug(`removing index ${originalIndex} from future suggestions`);

  const newSeenSuggestions: SeenSuggestions = {
    ...seenSuggestions,
    [category]: [...(seenSuggestions[category] || []), originalIndex],
  };

  return [suggestion, newSeenSuggestions];
};
