import {
  getEventOccupiedSlotIds,
  getEventParticipantIds,
} from "../../scheduler/getSchedulingErrors";
import type { Event } from "../../types";

export const getOccupiedSlotIdsByAttendee = (events: Event[]) => {
  const occupiedSlotIdsByAttendee = new Map<string, Set<string>>();

  for (const event of events) {
    for (const attendeeId of getEventParticipantIds(event)) {
      const occupiedSlotIds =
        occupiedSlotIdsByAttendee.get(attendeeId) ?? new Set<string>();
      for (const slotId of getEventOccupiedSlotIds(event)) {
        occupiedSlotIds.add(slotId);
      }
      occupiedSlotIdsByAttendee.set(attendeeId, occupiedSlotIds);
    }
  }

  return occupiedSlotIdsByAttendee;
};
