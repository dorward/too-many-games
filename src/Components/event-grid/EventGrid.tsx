import type { Event, OrganisedScheduleDays } from "../../types";
import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import { EventGridBody } from "./EventGridBody";
import { EventComponent } from "../Event/Event";
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

export const EventGrid = () => {
  const { data } = useTooManyGamesData();

  if (!data) {
    throw new Error("missing data");
  }

  const { events } = data;
  const { schedule, unscheduled } = prepareEventsForRendering(events);
  const maxGamesPerDay = getMaxGamesPerDay(schedule);

  return (
    <>
      <table className="eventGrid">
        <col />
        <col />
        <col />
        <col />
        <thead>
          <th>Day</th>
          <th>Morning</th>
          <th>Afternoon</th>
          <th>Evening</th>
        </thead>
        <tbody>
          <EventGridBody maxEventsPerDay={maxGamesPerDay} schedule={schedule} />
        </tbody>
      </table>
      {unscheduled.length > 0 && (
        <>
          <h2>Unscheduled</h2>
          <ul className="unscheduled">
            {unscheduled.map((event) => (
              <li key={event.id}>
                <EventComponent key={event.id} event={event} />
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};
