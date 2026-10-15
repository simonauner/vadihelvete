'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { rateLimit } from '@/lib/rateLimit';
import { isId, newId, parseLines, parseText } from '@/lib/store';
import {
  addChore,
  addMember,
  completeTask,
  createHousehold,
  LIMITS,
  parseWho,
  refuseTask,
  removeChore,
  removeMember,
  resetHousehold,
  undoTask,
  type ChoreInput,
  type Household,
  type Make,
} from './model';
import { loadHousehold, saveHousehold } from './store';

const make: Make = { id: () => newId(6), random: Math.random };

export type CreateState = { error?: string };

export const createHouseholdAction = async (
  _previous: CreateState,
  formData: FormData
): Promise<CreateState> => {
  const name = parseText(formData.get('name'), LIMITS.name) || 'Hushållet';
  const members = parseLines(formData.get('members'), {
    max: LIMITS.members,
    maxLength: LIMITS.memberName,
  });
  const whos = formData.getAll('who');
  const seen = new Set<string>();
  const chores: ChoreInput[] = formData
    .getAll('chore')
    .map((text, index) => ({
      text: parseText(text, LIMITS.choreText),
      ...parseWho(whos[index], members),
    }))
    .filter(({ text }) => {
      if (!text || seen.has(text)) return false;
      seen.add(text);
      return true;
    })
    .slice(0, LIMITS.chores);

  if (!members.length) return { error: 'Någon måste ju för i helvete bo där.' };
  if (!chores.length)
    return { error: 'Inga sysslor? Ljug inte för i helvete.' };

  const allowed = await rateLimit('lista-create', {
    requests: 10,
    window: '1 h',
    windowMs: 60 * 60 * 1000,
  });
  if (!allowed)
    return { error: 'Du har skapat nog med listor. Gör sysslorna istället.' };

  const id = newId();
  await saveHousehold(
    createHousehold({
      id,
      name,
      members,
      chores,
      make,
      now: Date.now(),
    })
  );

  redirect(`/lista/${id}`);
};

const update = async (
  id: unknown,
  change: (household: Household) => Household
) => {
  if (typeof id !== 'string' || !isId(id)) return;

  const household = await loadHousehold(id);
  if (!household) return;

  await saveHousehold(change(household));
  revalidatePath(`/lista/${id}`);
};

export const completeTaskAction = async (id: unknown, taskId: unknown) =>
  update(id, (h) => completeTask(h, String(taskId), Date.now()));

export const undoTaskAction = async (id: unknown, taskId: unknown) =>
  update(id, (h) => undoTask(h, String(taskId)));

export const refuseTaskAction = async (
  id: unknown,
  taskId: unknown,
  by: unknown
) => update(id, (h) => refuseTask(h, String(taskId), String(by), make));

export const resetAction = async (id: unknown) =>
  update(id, (h) => resetHousehold(h, make));

export const removeChoreAction = async (id: unknown, choreId: unknown) =>
  update(id, (h) => removeChore(h, String(choreId)));

export const removeMemberAction = async (id: unknown, name: unknown) =>
  update(id, (h) => removeMember(h, String(name), make));

export const addChoreAction = async (id: unknown, formData: FormData) => {
  const text = parseText(formData.get('text'), LIMITS.choreText);
  const who = formData.get('who');
  if (text) {
    await update(id, (h) =>
      addChore(h, { text, ...parseWho(who, h.members) }, make)
    );
  }
};

export const addMemberAction = async (id: unknown, formData: FormData) => {
  const name = parseText(formData.get('name'), LIMITS.memberName);
  if (name) await update(id, (h) => addMember(h, name, make));
};
