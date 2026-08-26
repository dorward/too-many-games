// oxlint-disable no-multi-assign
import type { Event, OrganisedScheduleDays } from "../../types";
import { useMemo } from "react";
import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import { getSchedulingErrors } from "../../scheduler/getSchedulingErrors";
import { eventHasParticipant } from "../../util/eventHasParticipant";
import { EventGridTable } from "./EventGridTable";
import { UnscheduledEvents } from "./UnscheduledEvents";
import "./eventGrid.css";

const prepareEventsForRendering = (events: Event[]) => {
  const schedule: OrganisedScheduleDays = {};
  const unscheduled: Event[] = [];

  events
    .toSorted((a, b) => (a.startSlot ?? "").localeCompare(b.startSlot ?? ""))
    .forEach((event) => {
      const { startSlot, length } = event;
      if (startSlot === undefined) {
        unscheduled.push(event);
        return;
      }
      const [year, month, dayOfMonth, slotNumberStr] = startSlot.split("-");
      const day = `${year}-${month}-${dayOfMonth}`;
      const slotsToday = (schedule[day] ??= {});
      const startSlotEvents = (slotsToday[startSlot] ??= []);
      const undefinedIndex = startSlotEvents.findIndex(
        (possibleSpaceForAnEvent) => possibleSpaceForAnEvent === undefined,
      );
      const targetIndex = undefinedIndex === -1 ? startSlotEvents.length : undefinedIndex;
      startSlotEvents[targetIndex] = event;

      const slotNo = parseInt(slotNumberStr, 10);
      if (length > 1) {
        const secondSlot = `${day}-${slotNo + 1}`;
        const secondSlotEvents = (slotsToday[secondSlot] ??= []);
        secondSlotEvents[targetIndex] = null;
      }
      if (length > 2) {
        const thirdSlot = `${day}-${slotNo + 2}`;
        const thirdSlotEvents = (slotsToday[thirdSlot] ??= []);
        thirdSlotEvents[targetIndex] = null;
      }
    });

  return { schedule, unscheduled };
};

const getMaxGamesPerDay = (schedule: OrganisedScheduleDays) => {
  const maxGamesPerDay: Record<string, number> = {};
  Object.entries(schedule).forEach(([date, slots]) => {
    const max = Object.values(slots).reduce(
      (maxSoFar, current) => Math.max(maxSoFar, current.length),
      0,
    );
    maxGamesPerDay[date] = max;
  });

  return maxGamesPerDay;
};

interface EventGridProps {
  participantFilter: string;
}

export const EventGrid = ({ participantFilter }: EventGridProps) => {
  const { data } = useTooManyGamesData();

  if (!data) {
    throw new Error("missing data");
  }

  const { events } = data;
  const filteredEvents =
    participantFilter === ""
      ? events
      : events.filter((event) => eventHasParticipant(event, participantFilter));
  const schedulingErrors = useMemo(() => getSchedulingErrors(events), [events]);
  const { schedule, unscheduled } = prepareEventsForRendering(filteredEvents);
  const maxGamesPerDay = getMaxGamesPerDay(schedule);

  return (
    <>
      <EventGridTable
        maxGamesPerDay={maxGamesPerDay}
        schedule={schedule}
        schedulingErrors={schedulingErrors}
      />
      <UnscheduledEvents schedulingErrors={schedulingErrors} unscheduled={unscheduled} />
    </>
  );
};
