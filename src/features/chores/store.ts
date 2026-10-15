import { readJson, writeJson } from '@/lib/store';
import { fromStored, type Household, type StoredHousehold } from './model';

const TTL_SECONDS = 180 * 24 * 60 * 60;
const key = (id: string) => `lista:${id}`;

export const loadHousehold = async (id: string) => {
  const stored = await readJson<StoredHousehold>(key(id));
  return stored ? fromStored(stored) : null;
};

export const saveHousehold = (household: Household) =>
  writeJson(key(household.id), household, TTL_SECONDS);
