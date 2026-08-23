import type { Event, EventWithScheduleHelpers, LocationChoice } from "../types";
import { SLOTS_PER_DAY } from "../consts";
import { getEventParticipantIds } from "./getSchedulingErrors";

const FIRST_MASK_BIT = 1n;
const EMPTY_MASK = 0n;

const maskForIndex = (index: number) => FIRST_MASK_BIT << BigInt(index);

const getParticipantMask = (participantIndexes: Map<string, number>, id: string) => {
  let index = participantIndexes.get(id);
  if (index === undefined) {
    index = participantIndexes.size;
    participantIndexes.set(id, index);
  }

  return maskForIndex(index);
};

const getLocationChoices = (allLocationIds: string[]) =>
  new Map<string, LocationChoice>(
    allLocationIds.map((id, index) => [id, { id, mask: maskForIndex(index) }]),
  );

const eventWillFinishByEndOfDay = (startIdx: number, length: number) =>
  (startIdx % SLOTS_PER_DAY) + length <= SLOTS_PER_DAY;

interface PrepEventContext {
  autoLocations: LocationChoice[];
  candidateStartIndexesByLength: Map<number, number[]>;
  locationChoices: Map<string, LocationChoice>;
  participantIndexes: Map<string, number>;
  slotIndexes: Map<string, number>;
}

const prepEvent = (
  event: Event,
  {
    autoLocations,
    candidateStartIndexesByLength,
    locationChoices,
    participantIndexes,
    slotIndexes,
  }: PrepEventContext,
): EventWithScheduleHelpers => {
  const participants = getEventParticipantIds(event);
  let participantMask = EMPTY_MASK;
  for (const participant of participants) {
    participantMask |= getParticipantMask(participantIndexes, participant);
  }

  const fixedLocation =
    event.location === undefined ? undefined : locationChoices.get(event.location);
  const preferredLocs = fixedLocation
    ? [fixedLocation]
    : event.preferredSpace
        .map((id) => locationChoices.get(id))
        .filter((choice): choice is LocationChoice => choice !== undefined);
  const preferredSet = new Set(preferredLocs.map(({ id }) => id));
  const fallbackLocs = fixedLocation
    ? []
    : autoLocations.filter(({ id }) => !preferredSet.has(id));
  const candidateStartIndexes = getCandidateStartIndexes(
    event,
    candidateStartIndexesByLength,
    slotIndexes,
  );

  return {
    candidateStartIndexes,
    event,
    fallbackLocs,
    isRequired: event.location !== undefined || event.startSlot !== undefined,
    length: event.length,
    participantCount: participants.size,
    participantMask,
    preferredLocs,
  };
};

const getCandidateStartIndexesByLength = (events: Event[], slotCount: number) => {
  const candidateStartIndexesByLength = new Map<number, number[]>();
  const lengths = new Set(events.map(({ length }) => length));
  for (const length of lengths) {
    const starts: number[] = [];
    const lastStart = slotCount - length;
    for (let startIdx = 0; startIdx <= lastStart; startIdx++) {
      if ((startIdx % SLOTS_PER_DAY) + length <= SLOTS_PER_DAY) {
        starts.push(startIdx);
      }
    }
    candidateStartIndexesByLength.set(length, starts);
  }
  return candidateStartIndexesByLength;
};

const getCandidateStartIndexes = (
  event: Event,
  candidateStartIndexesByLength: Map<number, number[]>,
  slotIndexes: Map<string, number>,
) => {
  if (event.startSlot === undefined) {
    return candidateStartIndexesByLength.get(event.length) ?? [];
  }

  const startIdx = slotIndexes.get(event.startSlot);
  if (startIdx === undefined || !eventWillFinishByEndOfDay(startIdx, event.length)) {
    return [];
  }

  return [startIdx];
};

export const prepEvents = (
  events: Event[],
  allLocationIds: string[],
  autoLocationIds: Set<string>,
  slots: string[],
): EventWithScheduleHelpers[] => {
  const locationChoices = getLocationChoices(allLocationIds);
  const autoLocations = allLocationIds
    .filter((id) => autoLocationIds.has(id))
    .map((id) => locationChoices.get(id)!);

  const participantIndexes = new Map<string, number>();
  const candidateStartIndexesByLength = getCandidateStartIndexesByLength(events, slots.length);
  const slotIndexes = new Map(slots.map((slot, index) => [slot, index]));
  const prepEventContext = {
    autoLocations,
    candidateStartIndexesByLength,
    locationChoices,
    participantIndexes,
    slotIndexes,
  };

  return events
    .map((event) => prepEvent(event, prepEventContext))
    .toSorted((a, b) => {
      const locationCountA = a.preferredLocs.length + a.fallbackLocs.length;
      const locationCountB = b.preferredLocs.length + b.fallbackLocs.length;
      const placementDiff =
        a.candidateStartIndexes.length * locationCountA -
        b.candidateStartIndexes.length * locationCountB;
      if (placementDiff !== 0) {
        return placementDiff;
      }

      const lengthDiff = b.length - a.length;
      if (lengthDiff !== 0) {
        return lengthDiff;
      }

      const playerDiff = b.participantCount - a.participantCount;
      if (playerDiff !== 0) {
        return playerDiff;
      }

      return locationCountA - locationCountB;
    });
};
