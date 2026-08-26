import { SLOTS_PER_DAY } from "../consts";
import { generateSlotIds } from "../scheduler/generateSlotIds";
import { getEventOccupiedSlotIds } from "../scheduler/getSchedulingErrors";
import type { AppData, Event } from "../types";

const invalidAppData = (message: string): never => {
  throw new Error(`Invalid data: ${message}`);
};

const getUniqueIds = (items: { id: string }[], label: string) => {
  const ids = new Set<string>();
  for (const { id } of items) {
    if (id.length === 0) {
      invalidAppData(`${label} must have non-empty IDs`);
    }
    if (ids.has(id)) {
      invalidAppData(`Duplicate ${label} ID: ${id}`);
    }
    ids.add(id);
  }
  return ids;
};

const validateReferencedIds = (ids: string[], knownIds: Set<string>, label: string) => {
  const seenIds = new Set<string>();
  for (const id of ids) {
    if (!knownIds.has(id)) {
      invalidAppData(`${label} references an unknown ID: ${id}`);
    }
    if (seenIds.has(id)) {
      invalidAppData(`${label} contains the same ID more than once: ${id}`);
    }
    seenIds.add(id);
  }
};

const validatePlayerCount = ({ playerCount }: Event, label: string) => {
  const { desirable, max, min } = playerCount;
  if (
    !Number.isInteger(min) ||
    !Number.isInteger(desirable) ||
    !Number.isInteger(max) ||
    min < 0 ||
    min > desirable ||
    desirable > max
  ) {
    invalidAppData(`${label} has invalid player counts`);
  }
};

const validateScheduledSlots = (event: Event, slotIds: Set<string>, label: string) => {
  if (event.startSlot === undefined) {
    return;
  }
  if (!getEventOccupiedSlotIds(event).every((slotId) => slotIds.has(slotId))) {
    invalidAppData(`${label} is scheduled outside the available time slots`);
  }
};

const validateEvent = (
  event: Event,
  eventNumber: number,
  attendeeIds: Set<string>,
  locationIds: Set<string>,
  slotIds: Set<string>,
) => {
  const label = `Event ${eventNumber} (${event.name})`;
  if (!Number.isInteger(event.length) || event.length < 1 || event.length > SLOTS_PER_DAY) {
    invalidAppData(`${label} has an invalid length`);
  }
  validatePlayerCount(event, label);
  validateReferencedIds([event.facilitator], attendeeIds, `${label} facilitator`);
  validateReferencedIds(event.players, attendeeIds, `${label} players`);
  validateReferencedIds(event.waitList, attendeeIds, `${label} wait list`);
  validateReferencedIds(event.preferredSpace, locationIds, `${label} preferred spaces`);
  if (event.players.some((id) => event.waitList.includes(id))) {
    invalidAppData(`${label} has attendees in both the player and wait lists`);
  }
  if (event.location !== undefined) {
    validateReferencedIds([event.location], locationIds, `${label} location`);
  }
  validateScheduledSlots(event, slotIds, label);
};

export const validateAppDataSemantics = (data: AppData) => {
  if (Number.isNaN(data.dates.start.getTime()) || Number.isNaN(data.dates.end.getTime())) {
    invalidAppData("The event dates must be valid dates");
  }
  if (data.dates.start >= data.dates.end) {
    invalidAppData("The event end date must be after the start date");
  }

  const attendeeIds = getUniqueIds(data.attendees, "attendee");
  const locationIds = getUniqueIds(data.locations, "location");
  getUniqueIds(data.events, "event");
  const slotIds = new Set(generateSlotIds(data.dates).slots);

  data.events.forEach((event, index) => {
    validateEvent(event, index + 1, attendeeIds, locationIds, slotIds);
  });
};
