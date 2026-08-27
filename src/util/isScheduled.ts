import type { Event } from "../types";

type ScheduledEvent = Event & Required<Pick<Event, "location" | "startSlot">>;

export const isScheduled = (event: Event): event is ScheduledEvent =>
  event.startSlot !== undefined && event.location !== undefined;
