import type { EventWithScheduleHelpers, LocationChoice, Store } from "../types";
import { canPlaceInValidDay } from "./canPlace";

const forEachLocationPlacement = (
  store: Store,
  item: EventWithScheduleHelpers,
  locations: EventWithScheduleHelpers["preferredLocs"],
  callback: (startIdx: number, location: LocationChoice) => boolean | void,
) => {
  for (const startIdx of item.candidateStartIndexes) {
    for (const location of locations) {
      if (
        canPlaceInValidDay(store, item, startIdx, location) &&
        callback(startIdx, location) === false
      ) {
        return false;
      }
    }
  }
  return true;
};

export const forEachValidPlacement = (
  store: Store,
  item: EventWithScheduleHelpers,
  callback: (startIdx: number, location: LocationChoice) => boolean | void,
) => {
  if (!forEachLocationPlacement(store, item, item.preferredLocs, callback)) {
    return;
  }
  forEachLocationPlacement(store, item, item.fallbackLocs, callback);
};
