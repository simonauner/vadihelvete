export type Answer = { text: string; mood: 'ja' | 'nej' | 'kanske' };

export const answers: Answer[] = [
  { text: 'Ja för i helvete.', mood: 'ja' },
  { text: 'Självklart, vad väntar du på?', mood: 'ja' },
  { text: 'Ja. Och gör det nu.', mood: 'ja' },
  { text: 'Ja, men du kommer ångra dig.', mood: 'ja' },
  { text: 'Svaret är ja, men frågan är dum.', mood: 'ja' },
  { text: 'Gör det. Vad är det värsta som kan hända?', mood: 'ja' },
  { text: 'Absolut inte, är du dum?', mood: 'nej' },
  { text: 'Nej. Nästa fråga.', mood: 'nej' },
  { text: 'Under inga jävla omständigheter.', mood: 'nej' },
  { text: 'Nej, och det vet du.', mood: 'nej' },
  { text: 'Är du seriös? Nej.', mood: 'nej' },
  { text: 'Nej. Gå och lägg dig.', mood: 'nej' },
  { text: 'Kanske. Sluta tjata.', mood: 'kanske' },
  { text: 'Fråga mig inte, fråga din mamma.', mood: 'kanske' },
  { text: 'Det vet du redan.', mood: 'kanske' },
  { text: 'Prova igen när du har druckit kaffe.', mood: 'kanske' },
  { text: 'Ingen kommentar.', mood: 'kanske' },
  { text: 'Ring och fråga någon vuxen.', mood: 'kanske' },
];

/** Picks an answer, never the same one twice in a row. */
export const pickAnswer = (
  previous: Answer | undefined,
  random: () => number = Math.random
): Answer => {
  const pool = answers.filter((answer) => answer !== previous);
  return pool[Math.floor(random() * pool.length)];
};
