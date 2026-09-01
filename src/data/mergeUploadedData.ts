import { getEventOccupiedSlotIds } from "../scheduler/getSchedulingErrors";
import { generateSlotIds } from "../scheduler/generateSlotIds";
import type { AppData, Event } from "../types";
import { validateAppDataSemantics } from "./validateAppDataSemantics";

interface NamedItem {
  id: string;
  name: string;
}

const getUniqueItemsByName = <Item extends NamedItem>(items: Item[]) => {
  const itemsByName = new Map<string, Item | null>();

  for (const item of items) {
    itemsByName.set(item.name, itemsByName.has(item.name) ? null : item);
  }

  return itemsByName;
};

const getMatchingItem = <Item extends NamedItem>(
  item: Item,
  currentItemsById: Map<string, Item>,
  currentItemsByName: Map<string, Item | null>,
) => currentItemsById.get(item.id) ?? currentItemsByName.get(item.name) ?? undefined;

const reconcileNamedItems = <Item extends NamedItem>(currentItems: Item[], uploadedItems: Item[]) => {
  const currentItemsById = new Map(currentItems.map((item) => [item.id, item]));
  const currentItemsByName = getUniqueItemsByName(currentItems);
  const uploadedNames = getUniqueItemsByName(uploadedItems);
  const uploadedIdToReconciledId = new Map<string, string>();

  const items = uploadedItems.map((item) => {
    const matchingItem =
      uploadedNames.get(item.name) === null
        ? currentItemsById.get(item.id)
        : getMatchingItem(item, currentItemsById, currentItemsByName);
    const id = matchingItem?.id ?? item.id;
    uploadedIdToReconciledId.set(item.id, id);
    return { ...item, id };
  });

  return { items, uploadedIdToReconciledId };
};

const remapEventReferences = (
  event: Event,
  attendeeIds: Map<string, string>,
  locationIds: Map<string, string>,
): Event => {
  const remappedEvent = {
    ...event,
    facilitator: attendeeIds.get(event.facilitator) ?? event.facilitator,
    players: event.players.map((id) => attendeeIds.get(id) ?? id),
    preferredSpace: event.preferredSpace.map((id) => locationIds.get(id) ?? id),
    waitList: event.waitList.map((id) => attendeeIds.get(id) ?? id),
  };

  if (event.location === undefined) {
    return remappedEvent;
  }
  return { ...remappedEvent, location: locationIds.get(event.location) ?? event.location };
};

const copyExistingSchedule = (
  event: Event,
  currentEvent: Event,
  locationIds: Set<string>,
  slotIds: Set<string>,
): Event => {
  const mergedEvent = { ...event, id: currentEvent.id };

  if (currentEvent.location !== undefined && locationIds.has(currentEvent.location)) {
    mergedEvent.location = currentEvent.location;
  } else {
    delete mergedEvent.location;
  }

  if (currentEvent.startSlot === undefined) {
    delete mergedEvent.startSlot;
  } else {
    mergedEvent.startSlot = currentEvent.startSlot;
    if (!getEventOccupiedSlotIds(mergedEvent).every((slotId) => slotIds.has(slotId))) {
      delete mergedEvent.startSlot;
    }
  }

  return mergedEvent;
};

export const mergeUploadedData = (currentData: AppData, uploadedData: AppData): AppData => {
  const reconciledAttendees = reconcileNamedItems(currentData.attendees, uploadedData.attendees);
  const reconciledLocations = reconcileNamedItems(currentData.locations, uploadedData.locations);
  const currentEventsById = new Map(currentData.events.map((event) => [event.id, event]));
  const currentEventsByName = getUniqueItemsByName(currentData.events);
  const uploadedNames = getUniqueItemsByName(uploadedData.events);
  const locationIds = new Set(reconciledLocations.items.map(({ id }) => id));
  const slotIds = new Set(generateSlotIds(uploadedData.dates).slots);

  const events = uploadedData.events.map((uploadedEvent) => {
    const event = remapEventReferences(
      uploadedEvent,
      reconciledAttendees.uploadedIdToReconciledId,
      reconciledLocations.uploadedIdToReconciledId,
    );
    const currentEvent =
      uploadedNames.get(uploadedEvent.name) === null
        ? currentEventsById.get(uploadedEvent.id)
        : getMatchingItem(uploadedEvent, currentEventsById, currentEventsByName);

    if (currentEvent !== undefined) {
      return copyExistingSchedule(event, currentEvent, locationIds, slotIds);
    }
    return event;
  });

  const mergedData = {
    ...uploadedData,
    attendees: reconciledAttendees.items,
    events,
    locations: reconciledLocations.items,
  };
  validateAppDataSemantics(mergedData);
  return mergedData;
};
