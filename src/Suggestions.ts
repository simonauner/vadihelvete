type collectionType = {
  home: string[];
  it: string[];
};

const collection: collectionType = {
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
    'göra rent i köket',
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

type suggestionTypes = keyof collectionType;

export const getSuggestion = (type: suggestionTypes = 'home') => {
  const suggestions = collection[type];
  return suggestions[Math.round(Math.random() * (suggestions.length - 1))];
};
