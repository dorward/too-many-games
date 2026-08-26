import { useState } from "react";
import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import { describeSchedule } from "../../scheduler/describeSchedule";
import { eventHasParticipant } from "../../util/eventHasParticipant";
import type { Event } from "../../types";
import { SortableHeader } from "../sortable-table/SortableHeader";
import { getNextSortDirection, type SortDirection, sortDirections } from "../sortable-table/sortDirection";
import "./event-list.css";

export type EventListSortColumn = "event" | "maxSeats" | "players" | "scheduled";

interface EventListProps {
  participantFilter: string;
  sortBy?: EventListSortColumn;
}

interface EventListHeaderProps {
  onSort: (column: EventListSortColumn) => void;
  sortBy: EventListSortColumn;
  sortDirection: SortDirection;
}

interface EventListBodyProps {
  events: Event[];
}

const compareByName = (a: Event, b: Event) => a.name.localeCompare(b.name);

const sortEvents = (events: Event[], sortBy: EventListSortColumn, direction: SortDirection) =>
  events.toSorted((a, b) => {
    const directionModifier = sortDirections[direction];

    if (sortBy === "scheduled") {
      return directionModifier * (
        (a.startSlot ?? "").localeCompare(b.startSlot ?? "") || a.name.localeCompare(b.name)
      );
    }

    if (sortBy === "players") {
      return directionModifier * (a.players.length - b.players.length || compareByName(a, b));
    }

    if (sortBy === "maxSeats") {
      return directionModifier * (a.playerCount.max - b.playerCount.max || compareByName(a, b));
    }

    return directionModifier * compareByName(a, b);
  });

const EventListHeader = ({ onSort, sortBy, sortDirection }: EventListHeaderProps) => (
  <thead>
    <tr>
      <SortableHeader
        className="event-list-event"
        column="event"
        direction={sortDirection}
        onSort={onSort}
        sortBy={sortBy}
      >
        Event
      </SortableHeader>
      <SortableHeader
        className="event-list-players"
        column="players"
        direction={sortDirection}
        onSort={onSort}
        sortBy={sortBy}
      >
        Players
      </SortableHeader>
      <SortableHeader
        className="event-list-max-seats"
        column="maxSeats"
        direction={sortDirection}
        onSort={onSort}
        sortBy={sortBy}
      >
        Max Seats
      </SortableHeader>
      <SortableHeader
        className="event-list-scheduled"
        column="scheduled"
        direction={sortDirection}
        onSort={onSort}
        sortBy={sortBy}
      >
        Scheduled
      </SortableHeader>
    </tr>
  </thead>
);

const EventListBody = ({ events }: EventListBodyProps) => (
  <tbody>
    {events.map((event) => (
      <tr key={event.id}>
        <td className="event-list-event">{event.name}</td>
        <td className="event-list-players">{event.players.length}</td>
        <td className="event-list-max-seats">{event.playerCount.max}</td>
        <td className="event-list-scheduled">{describeSchedule(event)}</td>
      </tr>
    ))}
  </tbody>
);

export const EventList = ({ participantFilter, sortBy = "event" }: EventListProps) => {
  const [currentSortBy, setCurrentSortBy] = useState(sortBy);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const context = useTooManyGamesData();
  const { data } = context;
  if (!data) {
    return "Error";
  }
  const events =
    participantFilter === ""
      ? data.events
      : data.events.filter((event) => eventHasParticipant(event, participantFilter));
  const sortedEvents = sortEvents(events, currentSortBy, sortDirection);
  const onSort = (column: EventListSortColumn) => {
    setSortDirection(getNextSortDirection(currentSortBy, column, sortDirection));
    setCurrentSortBy(column);
  };

  return (
    <table className="event-list">
      <colgroup>
        <col className="event-list-event" />
        <col className="event-list-players" />
        <col className="event-list-max-seats" />
        <col className="event-list-scheduled" />
      </colgroup>
      <EventListHeader onSort={onSort} sortBy={currentSortBy} sortDirection={sortDirection} />
      <EventListBody events={sortedEvents} />
    </table>
  );
};
