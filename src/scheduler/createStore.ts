import type { Store } from "../types";

const EMPTY_MASK = 0n;

export const createStore = (slotCount: number): Store => {
  const slotLocationMasks = Array<bigint>(slotCount).fill(EMPTY_MASK);
  const slotPlayerMasks = Array<bigint>(slotCount).fill(EMPTY_MASK);
  const assignments = new Map<string, { startSlot: string; location: string }>();

  return { assignments, slotLocationMasks, slotPlayerMasks };
};
