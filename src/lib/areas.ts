export type Area = {
  href: string;
  emoji: string;
  question: string;
  description: string;
};

export type AreaGroup = { title: string; areas: Area[] };

export const areaGroups: AreaGroup[] = [
  {
    title: 'Just nu',
    areas: [
      {
        href: '/ha-pa-mig',
        emoji: '🧥',
        question: 'ska jag ha på mig?',
        description: 'SMHI:s prognos, fast med en åsikt.',
      },
      {
        href: '/idag',
        emoji: '📅',
        question: 'är det för dag idag?',
        description: 'Temadag, namnsdag och flaggdag. Med åsikter.',
      },
      {
        href: '/fredag',
        emoji: '🍻',
        question: 'är det fredag snart?',
        description: 'Nej. Med nedräkning till fredagsölen.',
      },
      {
        href: '/lon',
        emoji: '💸',
        question: 'när kommer lönen?',
        description: 'Nedräkning till lönedagen. Lägg ner kortet.',
      },
    ],
  },
  {
    title: 'Gör något',
    areas: [
      {
        href: '/hemma',
        emoji: '🧹',
        question: 'ska jag göra hemma?',
        description: 'Sysslor du för i helvete borde ha gjort redan.',
      },
      {
        href: '/it',
        emoji: '🖥️',
        question: 'ska jag koda?',
        description: 'För den som har tråkigt på jobbet.',
      },
    ],
  },
  {
    title: 'Hjälp mig',
    areas: [
      {
        href: '/ursakt',
        emoji: '🙄',
        question: 'ska jag skylla på?',
        description: 'Ursäkter för dig som kom sent. Igen.',
      },
      {
        href: '/svar',
        emoji: '🎱',
        question: 'ska jag göra, ja eller nej?',
        description: 'En arg spåkula som säger som det är.',
      },
    ],
  },
  {
    title: 'Tillsammans',
    areas: [
      {
        href: '/lista',
        emoji: '🧽',
        question: 'är det min tur att diska?',
        description: 'Delad sysslolista som skäller ut rätt person.',
      },
      {
        href: '/bestam',
        emoji: '🗳️',
        question: 'ska vi göra?',
        description: 'Rösta med gänget. Annars bestämmer jag.',
      },
    ],
  },
];
