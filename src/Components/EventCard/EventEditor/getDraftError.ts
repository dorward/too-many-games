import { getSchedulingErrors } from "../../../scheduler/getSchedulingErrors";
import type { Event } from "../../../types";

export const getDraftError = (
  events: Event[],
  eventId: Event["id"],
  location: Event["location"],
  players: Event["players"],
  startSlot: Event["startSlot"],
) =>
  getSchedulingErrors(
    events.map((candidate) =>
      candidate.id === eventId ? { ...candidate, location, players, startSlot } : candidate,
    ),
  ).get(eventId);
