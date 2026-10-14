'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { rateLimit } from '@/lib/rateLimit';
import { isId, newId, parseLines, parseText } from '@/lib/store';
import { addOption, decide, LIMITS, reset, vote, type Room } from './model';
import { loadRoom, saveRoom } from './store';
import { ensureVoterId } from './voter';

export type CreateRoomState = { error?: string };

export const createRoomAction = async (
  _previous: CreateRoomState,
  formData: FormData
): Promise<CreateRoomState> => {
  const question =
    parseText(formData.get('question'), LIMITS.question) ||
    'Vad i helvete ska vi göra?';
  const options = parseLines(formData.get('options'), {
    max: LIMITS.options,
    maxLength: LIMITS.optionText,
  });

  if (options.length < 2) {
    return {
      error: 'Minst två alternativ för i helvete, annars är det ju inget val.',
    };
  }

  const allowed = await rateLimit('bestam-create', {
    requests: 20,
    window: '1 h',
    windowMs: 60 * 60 * 1000,
  });
  if (!allowed) return { error: 'Nu har du skapat nog med rum. Bestäm dig.' };

  const id = newId();
  await saveRoom({
    id,
    question,
    options: options.map((text) => ({ id: newId(6), text, voters: [] })),
    createdAt: Date.now(),
  });

  redirect(`/bestam/${id}`);
};

const update = async (id: unknown, change: (room: Room) => Room) => {
  if (typeof id !== 'string' || !isId(id)) return;

  const room = await loadRoom(id);
  if (!room) return;

  await saveRoom(change(room));
  revalidatePath(`/bestam/${id}`);
};

export const voteAction = async (id: unknown, optionId: unknown) => {
  const voter = await ensureVoterId();
  await update(id, (room) =>
    room.decision ? room : vote(room, String(optionId), voter)
  );
};

export const decideAction = async (id: unknown) =>
  update(id, (room) => decide(room, Date.now()));

export const resetAction = async (id: unknown) => update(id, reset);

export const addOptionAction = async (id: unknown, formData: FormData) => {
  const text = parseText(formData.get('text'), LIMITS.optionText);
  if (text) await update(id, (room) => addOption(room, text, newId(6)));
};
