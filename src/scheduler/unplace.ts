import type { EventWithScheduleHelpers, LocationChoice, Store } from "../types";

export const unplace = (
  store: Store,
  item: EventWithScheduleHelpers,
  startIdx: number,
  location: LocationChoice,
) => {
  const { assignments, slotLocationMasks, slotPlayerMasks } = store;

  for (let offset = 0; offset < item.length; offset++) {
    const slotIdx = startIdx + offset;
    slotLocationMasks[slotIdx] ^= location.mask;
    slotPlayerMasks[slotIdx] ^= item.participantMask;
  }
  assignments.delete(item.event.id);
};
