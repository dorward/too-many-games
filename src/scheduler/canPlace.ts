import type { EventWithScheduleHelpers, LocationChoice, Store } from "../types";
import { SLOTS_PER_DAY } from "../consts";

const EMPTY_MASK = 0n;

/**
 * Checks only dynamic occupancy constraints.
 *
 * Static end-of-day validity is handled before this hot-path check, so this
 * function stays on the hot path as small as possible.
 */
export const canPlace = (
  store: Store,
  item: EventWithScheduleHelpers,
  startIdx: number,
  location: LocationChoice,
): boolean => {
  // Defensive check for callers that have not prevalidated static slot rules.
  if ((startIdx % SLOTS_PER_DAY) + item.length > SLOTS_PER_DAY) {
    return false;
  }

  return canPlaceInValidDay(store, item, startIdx, location);
};

export const canPlaceInValidDay = (
  store: Store,
  item: EventWithScheduleHelpers,
  startIdx: number,
  location: LocationChoice,
): boolean => {
  const { slotLocationMasks, slotPlayerMasks } = store;
  const { length, participantMask } = item;

  for (let offset = 0; offset < length; offset++) {
    const slotIdx = startIdx + offset;
    if ((slotLocationMasks[slotIdx] & location.mask) !== EMPTY_MASK) {
      return false;
    }

    if ((slotPlayerMasks[slotIdx] & participantMask) !== EMPTY_MASK) {
      return false;
    }
  }

  return true;
};
