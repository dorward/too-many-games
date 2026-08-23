import type { Event } from "../types";

export interface SchedulingError {
  hasError: boolean;
  location: boolean;
  participantIds: Set<string>;
}

export type SchedulingErrors = Map<string, SchedulingError>;
type EventIdsByConflictKey = Map<string, Map<string, Set<string>>>;

const emptySchedulingError = (): SchedulingError => ({
  hasError: false,
  location: false,
  participantIds: new Set<string>(),
});

const getOrCreateError = (errors: SchedulingErrors, eventId: string) => {
  const existing = errors.get(eventId);
  if (existing) {
    return existing;
  }

  const error = emptySchedulingError();
  errors.set(eventId, error);
  return error;
};

const markLocationError = (errors: SchedulingErrors, eventIds: Set<string>) => {
  if (eventIds.size < 2) {
    return;
  }

  for (const eventId of eventIds) {
    const error = getOrCreateError(errors, eventId);
    error.hasError = true;
    error.location = true;
  }
};

const markParticipantError = (
  errors: SchedulingErrors,
  participantId: string,
  eventIds: Set<string>,
) => {
  if (eventIds.size < 2) {
    return;
  }

  for (const eventId of eventIds) {
    const error = getOrCreateError(errors, eventId);
    error.hasError = true;
    error.participantIds.add(participantId);
  }
};

export const getEventOccupiedSlotIds = (event: Event) => {
  if (event.startSlot === undefined) {
    return [];
  }

  const [year, month, dayOfMonth, slotNumberStr] = event.startSlot.split("-");
  const day = `${year}-${month}-${dayOfMonth}`;
  const slotNumber = parseInt(slotNumberStr, 10);
  return Array.from({ length: event.length }, (_, offset) => `${day}-${slotNumber + offset}`);
};

export const getEventParticipantIds = (event: Event) =>
  new Set([event.facilitator, ...event.players]);

const addEventId = (
  conflicts: EventIdsByConflictKey,
  slot: string,
  conflictKey: string,
  eventId: string,
) => {
  const conflictsForSlot = conflicts.get(slot) ?? new Map<string, Set<string>>();
  const eventIds = conflictsForSlot.get(conflictKey) ?? new Set<string>();
  eventIds.add(eventId);
  conflictsForSlot.set(conflictKey, eventIds);
  conflicts.set(slot, conflictsForSlot);
};

const addEventToConflictIndexes = (
  locationsBySlot: EventIdsByConflictKey,
  participantsBySlot: EventIdsByConflictKey,
  event: Event,
) => {
  for (const slot of getEventOccupiedSlotIds(event)) {
    if (event.location !== undefined) {
      addEventId(locationsBySlot, slot, event.location, event.id);
    }

    for (const participantId of getEventParticipantIds(event)) {
      addEventId(participantsBySlot, slot, participantId, event.id);
    }
  }
};

const getConflictIndexes = (events: Event[]) => {
  const locationsBySlot: EventIdsByConflictKey = new Map();
  const participantsBySlot: EventIdsByConflictKey = new Map();

  events.forEach((event) => {
    addEventToConflictIndexes(locationsBySlot, participantsBySlot, event);
  });

  return { locationsBySlot, participantsBySlot };
};

const markLocationErrors = (errors: SchedulingErrors, locationsBySlot: EventIdsByConflictKey) => {
  for (const locations of locationsBySlot.values()) {
    for (const eventIds of locations.values()) {
      markLocationError(errors, eventIds);
    }
  }
};

const markParticipantErrors = (
  errors: SchedulingErrors,
  participantsBySlot: EventIdsByConflictKey,
) => {
  for (const participants of participantsBySlot.values()) {
    for (const [participantId, eventIds] of participants) {
      markParticipantError(errors, participantId, eventIds);
    }
  }
};

export const getSchedulingErrors = (events: Event[]): SchedulingErrors => {
  const errors: SchedulingErrors = new Map();
  const { locationsBySlot, participantsBySlot } = getConflictIndexes(events);

  markLocationErrors(errors, locationsBySlot);
  markParticipantErrors(errors, participantsBySlot);

  return errors;
};
