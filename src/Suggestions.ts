export const getSuggestion = (): string => {
  const suggestions = [
    "städa ditt rum",
    "fylla på diskmaskinen",
    "göra rent i köket",
    "plocka ur diskmaskinen",
    "sätta igång en tvätt",
    "vika tvätt",
    "hänga upp tvätt",
    "göra rent i badrummet",
  ];

  return suggestions[Math.round(Math.random() * suggestions.length)];
};
