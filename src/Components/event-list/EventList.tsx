import { useState } from "react";
import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import { describeSchedule } from "../../scheduler/describeSchedule";
import { eventHasParticipant } from "../../util/eventHasParticipant";
import type { Event, Location } from "../../types";
import { SortableHeader } from "../sortable-table/SortableHeader";
import { getNextSortDirection, type SortDirection, sortDirections } from "../sortable-table/sortDirection";
import "./event-list.css";

export type EventListSortColumn = "event" | "location" | "maxSeats" | "players" | "scheduled";

const eventListColumns: {
  className: string;
  column: EventListSortColumn;
  label: string;
}[] = [
  { className: "event-list-event", column: "event", label: "Event" },
  { className: "event-list-players", column: "players", label: "Players" },
  { className: "event-list-max-seats", column: "maxSeats", label: "Max Seats" },
  { className: "event-list-scheduled", column: "scheduled", label: "Scheduled" },
  { className: "event-list-location", column: "location", label: "Location" },
];

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
  locationNamesById: Map<Location["id"], Location["name"]>;
}

const compareByName = (a: Event, b: Event) => a.name.localeCompare(b.name);
const getLocationName = (event: Event, locationNamesById: Map<string, string>) =>
  locationNamesById.get(event.location ?? "") ?? "Unscheduled";

const sortEvents = (
  events: Event[],
  sortBy: EventListSortColumn,
  direction: SortDirection,
  locationNamesById: Map<string, string>,
) =>
  events.toSorted((a, b) => {
    const directionModifier = sortDirections[direction];

    if (sortBy === "scheduled") {
      return directionModifier * (
        (a.startSlot ?? "").localeCompare(b.startSlot ?? "") || a.name.localeCompare(b.name)
      );
    }

    if (sortBy === "location") {
      return directionModifier * (
        getLocationName(a, locationNamesById).localeCompare(
          getLocationName(b, locationNamesById),
        ) || compareByName(a, b)
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
      {eventListColumns.map(({ className, column, label }) => (
        <SortableHeader
          className={className}
          column={column}
          direction={sortDirection}
          key={column}
          onSort={onSort}
          sortBy={sortBy}
        >
          {label}
        </SortableHeader>
      ))}
    </tr>
  </thead>
);

const EventListBody = ({ events, locationNamesById }: EventListBodyProps) => (
  <tbody>
    {events.map((event) => (
      <tr key={event.id}>
        <td className="event-list-event">{event.name}</td>
        <td className="event-list-players">{event.players.length}</td>
        <td className="event-list-max-seats">{event.playerCount.max}</td>
        <td className="event-list-scheduled">{describeSchedule(event)}</td>
        <td className="event-list-location">{getLocationName(event, locationNamesById)}</td>
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
  const locationNamesById = new Map(data.locations.map(({ id, name }) => [id, name]));
  const sortedEvents = sortEvents(events, currentSortBy, sortDirection, locationNamesById);
  const onSort = (column: EventListSortColumn) => {
    setSortDirection(getNextSortDirection(currentSortBy, column, sortDirection));
    setCurrentSortBy(column);
  };

  return (
    <table className="event-list">
      <colgroup>
        {eventListColumns.map(({ className, column }) => (
          <col className={className} key={column} />
        ))}
      </colgroup>
      <EventListHeader onSort={onSort} sortBy={currentSortBy} sortDirection={sortDirection} />
      <EventListBody events={sortedEvents} locationNamesById={locationNamesById} />
    </table>
  );
};
