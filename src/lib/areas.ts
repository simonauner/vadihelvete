export type Area = {
  href: string;
  emoji: string;
  question: string;
  description: string;
};

export const areas: Area[] = [
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
    href: '/oversatt',
    emoji: '🗯️',
    question: 'betyder det?',
    description: 'LinkedIn-svammel och konsultsvenska på ren svenska.',
  },
];
