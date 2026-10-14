const situations = [
  'kom sent',
  'inte svarade på ditt sms',
  'missade mötet',
  'glömde din födelsedag',
  'inte diskade',
  'inte kom på festen',
  'är sen med rapporten',
  'glömde köpa mjölk',
  'inte ringde tillbaka',
  'somnade på mötet',
  'åt upp din matlåda',
  'inte svarade på mejlet',
] as const;

const reasons = [
  'en älg blockerade E4:an',
  'pendeln stod still i Flemingsberg i fyrtio minuter',
  'min mormor hackade mitt Netflix-konto',
  'jag fastnade i ett samtal med grannen om bergvärme',
  'katten satte sig på tangentbordet och mejlade hela företaget',
  'IKEA-hyllan jag byggde i går rasade över mig',
  'jag väntade in en leverans mellan 08 och 21',
  'självscanningen på ICA vägrade godkänna min gurka',
  'jag halkade på en semla',
  'BankID slutade fungera',
  'telefonen uppdaterade sig själv i tre timmar',
  'jag gick vilse på Mall of Scandinavia',
  'en duva tog min nyckel',
  'jag tittade på ett avsnitt till, och sen tolv till',
  'Teams ville starta om sig',
  'en turist frågade om vägen och jag följde med hela vägen',
  'grannens larm gick och ingen hittade nyckeln',
  'jag blev inlåst på en toalett på Pressbyrån',
  'fiket tog bara Swish och min Swish var låst',
  'jag satt i telefonkö hos 1177 i två timmar',
  'någon stal min cykel. Igen',
  'det var SJ',
  'det var för kallt',
  'det var för varmt',
  'det var tisdag',
  'mitt horoskop sa att jag skulle stanna hemma',
  'jag hamnade i en grupptalk med släkten om julen',
  'en mås åt min frukost',
  'jag lärde mig stricka och kunde inte sluta',
  'robotdammsugaren hade rymt',
] as const;

const endings = [
  'Det kommer inte hända igen. Förmodligen.',
  'Så egentligen är det ditt fel.',
  'Vi säger inget mer om det.',
  'Jag förväntar mig en ursäkt från dig nu.',
  'Tack för att du förstår, för i helvete.',
  'Ingen kunde ha förutsett det.',
  'Jag har redan förlåtit mig själv.',
  'Det är inget att diskutera.',
  'Fråga inte mer.',
  'Jag mår inte så bra av att prata om det.',
  'Det är sant, kolla med polisen.',
  'Så nu är vi kvitt.',
] as const;

export type Excuse = { code: string; text: string };

const build = (s: number, r: number, e: number): Excuse => ({
  code: `${s + 1}-${r + 1}-${e + 1}`,
  text: `Förlåt att jag ${situations[s]}, men ${reasons[r]}. ${endings[e]}`,
});

export const randomExcuse = (random: () => number = Math.random): Excuse =>
  build(
    Math.floor(random() * situations.length),
    Math.floor(random() * reasons.length),
    Math.floor(random() * endings.length)
  );

/** Codes are 1-based "situation-reason-ending", e.g. "3-12-7". */
export const excuseByCode = (code: string): Excuse | undefined => {
  const match = /^(\d{1,2})-(\d{1,2})-(\d{1,2})$/.exec(code);
  if (!match) return undefined;

  const [s, r, e] = match.slice(1).map((n) => Number(n) - 1);
  if (!situations[s] || !reasons[r] || !endings[e]) return undefined;

  return build(s, r, e);
};
