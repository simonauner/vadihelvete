import { readJson, writeJson } from '@/lib/store';
import type { Room } from './model';

const TTL_SECONDS = 14 * 24 * 60 * 60;
const key = (id: string) => `rum:${id}`;

export const loadRoom = (id: string) => readJson<Room>(key(id));

export const saveRoom = (room: Room) =>
  writeJson(key(room.id), room, TTL_SECONDS);
