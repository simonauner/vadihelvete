export type Mode = 'jobba' | 'paus' | 'langpaus';

export const modes: Record<
  Mode,
  { label: string; minutes: number; running: string; done: string }
> = {
  jobba: {
    label: 'Jobba',
    minutes: 25,
    running: 'Jobba för i helvete. Ingen mobil, inga mejl, ingen jävla Slack.',
    done: 'Bra jobbat. Ta en paus för i helvete.',
  },
  paus: {
    label: 'Paus',
    minutes: 5,
    running: 'Paus. Gå bort från skärmen för i helvete.',
    done: 'Pausen är slut. Jobba för i helvete.',
  },
  langpaus: {
    label: 'Lång paus',
    minutes: 15,
    running: 'Lång paus. Gå ut och ta en sväng för i helvete.',
    done: 'Nu har du vilat nog. Jobba för i helvete.',
  },
};

/** Every fourth finished work session earns a long break. */
export const nextMode = (finished: Mode, completedWork: number): Mode => {
  if (finished !== 'jobba') return 'jobba';
  return completedWork > 0 && completedWork % 4 === 0 ? 'langpaus' : 'paus';
};

export const durationMs = (mode: Mode) => modes[mode].minutes * 60_000;

export const formatClock = (ms: number) => {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
