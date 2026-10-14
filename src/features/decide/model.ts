export type RoomOption = { id: string; text: string; voters: string[] };

export type Decision = { optionId: string; at: number; byVotes: boolean };

export type Room = {
  id: string;
  question: string;
  options: RoomOption[];
  decision?: Decision;
  createdAt: number;
};

export const LIMITS = { question: 80, options: 20, optionText: 60 };

export type Preset = { slug: string; question: string; options: string[] };

export const presets: Preset[] = [
  {
    slug: 'ata',
    question: 'Vad i helvete ska vi äta?',
    options: [
      'Tacos',
      'Pizza',
      'Sushi',
      'Pasta',
      'Hamburgare',
      'Thai',
      'Kebab',
    ],
  },
  {
    slug: 'gora',
    question: 'Vad i helvete ska vi göra?',
    options: [
      'Gå på bio',
      'Ta en promenad',
      'Spela spel',
      'Gå på krogen',
      'Ligga i soffan',
      'Bowla',
    ],
  },
  {
    slug: 'kolla',
    question: 'Vad i helvete ska vi kolla på?',
    options: ['En film', 'En serie', 'En dokumentär', 'En gammal favorit'],
  },
];

export const vote = (room: Room, optionId: string, voter: string): Room => {
  const alreadyVoted = room.options.some(
    (option) => option.id === optionId && option.voters.includes(voter)
  );

  return {
    ...room,
    options: room.options.map((option) => {
      const voters = option.voters.filter((v) => v !== voter);
      // Clicking your own vote again takes it back.
      return option.id === optionId && !alreadyVoted
        ? { ...option, voters: [...voters, voter] }
        : { ...option, voters };
    }),
  };
};

export const decide = (
  room: Room,
  now: number,
  random: () => number = Math.random
): Room => {
  if (!room.options.length) return room;

  const most = Math.max(...room.options.map((o) => o.voters.length));
  const leaders = room.options.filter((o) => o.voters.length === most);
  const winner = leaders[Math.floor(random() * leaders.length)];

  return {
    ...room,
    decision: { optionId: winner.id, at: now, byVotes: most > 0 },
  };
};

export const reset = (room: Room): Room => ({
  ...room,
  decision: undefined,
  options: room.options.map((option) => ({ ...option, voters: [] })),
});

export const addOption = (room: Room, text: string, id: string): Room =>
  room.options.length >= LIMITS.options ||
  room.options.some((o) => o.text.toLowerCase() === text.toLowerCase())
    ? room
    : { ...room, options: [...room.options, { id, text, voters: [] }] };
