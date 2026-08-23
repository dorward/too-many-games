import type { Event, EventWithScheduleHelpers, LocationChoice } from "../types";
import { SLOTS_PER_DAY } from "../consts";

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

const prepEvent = (
  event: Event,
  locationChoices: Map<string, LocationChoice>,
  autoLocations: LocationChoice[],
  participantIndexes: Map<string, number>,
  candidateStartIndexesByLength: Map<number, number[]>,
): EventWithScheduleHelpers => {
  const participants = new Set([event.facilitator, ...event.players]);
  let participantMask = EMPTY_MASK;
  for (const participant of participants) {
    participantMask |= getParticipantMask(participantIndexes, participant);
  }

  const preferredLocs = event.preferredSpace
    .map((id) => locationChoices.get(id))
    .filter((choice): choice is LocationChoice => choice !== undefined);
  const preferredSet = new Set(preferredLocs.map(({ id }) => id));

  return {
    candidateStartIndexes: candidateStartIndexesByLength.get(event.length) ?? [],
    event,
    fallbackLocs: autoLocations.filter(({ id }) => !preferredSet.has(id)),
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

export const prepEvents = (
  events: Event[],
  allLocationIds: string[],
  autoLocationIds: Set<string>,
  slotCount: number,
): EventWithScheduleHelpers[] => {
  const locationChoices = getLocationChoices(allLocationIds);
  const autoLocations = allLocationIds
    .filter((id) => autoLocationIds.has(id))
    .map((id) => locationChoices.get(id)!);

  const participantIndexes = new Map<string, number>();
  const candidateStartIndexesByLength = getCandidateStartIndexesByLength(events, slotCount);

  return events
    .map((event) =>
      prepEvent(
        event,
        locationChoices,
        autoLocations,
        participantIndexes,
        candidateStartIndexesByLength,
      ),
    )
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
