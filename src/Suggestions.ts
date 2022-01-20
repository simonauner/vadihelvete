export const getSuggestion = (): string => {
  const suggestions = [
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
  ];

  return suggestions[Math.round(Math.random() * (suggestions.length - 1))];
};
