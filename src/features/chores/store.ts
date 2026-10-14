import { readJson, writeJson } from '@/lib/store';
import type { Household } from './model';

const TTL_SECONDS = 180 * 24 * 60 * 60;
const key = (id: string) => `lista:${id}`;

export const loadHousehold = (id: string) => readJson<Household>(key(id));

export const saveHousehold = (household: Household) =>
  writeJson(key(household.id), household, TTL_SECONDS);
