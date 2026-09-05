import type { SlotId } from "../../types";

const ISO_DATE_LENGTH = 10;

export const groupSlotsByDay = (slots: SlotId[]) => {
  const slotsByDay = new Map<string, SlotId[]>();
  for (const slot of slots) {
    const day = slot.slice(0, ISO_DATE_LENGTH);
    const daySlots = slotsByDay.get(day) ?? [];
    daySlots.push(slot);
    slotsByDay.set(day, daySlots);
  }
  return [...slotsByDay.entries()];
};
