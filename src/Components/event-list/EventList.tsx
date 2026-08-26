import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import { describeSchedule } from "../../scheduler/describeSchedule";
import { eventHasParticipant } from "../../util/eventHasParticipant";
import type { Event } from "../../types";
import "./event-list.css";

export type EventListSortColumn = "event" | "maxSeats" | "players" | "scheduled";

interface EventListProps {
  participantFilter: string;
  sortBy?: EventListSortColumn;
}

const sortEvents = (events: Event[], sortBy: EventListSortColumn) =>
  events.toSorted((a, b) => {
    if (sortBy === "scheduled") {
      return (
        (a.startSlot ?? "").localeCompare(b.startSlot ?? "") || a.name.localeCompare(b.name)
      );
    }

    if (sortBy === "players") {
      return a.players.length - b.players.length || a.name.localeCompare(b.name);
    }

    if (sortBy === "maxSeats") {
      return a.playerCount.max - b.playerCount.max || a.name.localeCompare(b.name);
    }

    return a.name.localeCompare(b.name);
  });

export const EventList = ({ participantFilter, sortBy = "event" }: EventListProps) => {
  const context = useTooManyGamesData();
  const { data } = context;
  if (!data) {
    return "Error";
  }
  const events =
    participantFilter === ""
      ? data.events
      : data.events.filter((event) => eventHasParticipant(event, participantFilter));
  const sortedEvents = sortEvents(events, sortBy);
  return (
    <table className="event-list">
      <colgroup>
        <col className="event-list-event" />
        <col className="event-list-players" />
        <col className="event-list-max-seats" />
        <col className="event-list-scheduled" />
      </colgroup>
      <thead>
        <tr>
          <th className="event-list-event">Event</th>
          <th className="event-list-players">Players</th>
          <th className="event-list-max-seats">Max Seats</th>
          <th className="event-list-scheduled">Scheduled</th>
        </tr>
      </thead>
      <tbody>
        {sortedEvents.map((event) => (
          <tr key={event.id}>
            <td className="event-list-event">{event.name}</td>
            <td className="event-list-players">{event.players.length}</td>
            <td className="event-list-max-seats">{event.playerCount.max}</td>
            <td className="event-list-scheduled">{describeSchedule(event)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
