'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { rateLimit } from '@/lib/rateLimit';
import { isId, newId, parseLines, parseText } from '@/lib/store';
import {
  addChore,
  addMember,
  completeChore,
  createHousehold,
  LIMITS,
  passChore,
  removeChore,
  removeMember,
  type Household,
} from './model';
import { loadHousehold, saveHousehold } from './store';

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
  const chores = parseLines(formData.get('chores'), {
    max: LIMITS.chores,
    maxLength: LIMITS.choreText,
  });

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
      choreId: () => newId(6),
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

export const completeChoreAction = async (id: unknown, choreId: unknown) =>
  update(id, (h) => completeChore(h, String(choreId), Date.now()));

export const passChoreAction = async (id: unknown, choreId: unknown) =>
  update(id, (h) => passChore(h, String(choreId)));

export const removeChoreAction = async (id: unknown, choreId: unknown) =>
  update(id, (h) => removeChore(h, String(choreId)));

export const removeMemberAction = async (id: unknown, name: unknown) =>
  update(id, (h) => removeMember(h, String(name)));

export const addChoreAction = async (id: unknown, formData: FormData) => {
  const text = parseText(formData.get('text'), LIMITS.choreText);
  if (text) await update(id, (h) => addChore(h, text, newId(6)));
};

export const addMemberAction = async (id: unknown, formData: FormData) => {
  const name = parseText(formData.get('name'), LIMITS.memberName);
  if (name) await update(id, (h) => addMember(h, name));
};
