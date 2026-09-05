import { useState } from "react";
import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import { eventHasParticipant } from "../../util/eventHasParticipant";
import { isScheduled } from "../../util/isScheduled";
import type { Event } from "../../types";
import { getNextSortDirection, type SortDirection, sortDirections } from "../SortableHeader/sortDirection";
import { EventListBody } from "./EventListBody";
import { EventListHeader } from "./EventListHeader";
import { eventListColumns, getLocationName, type EventListSortColumn } from "./eventListTable";
import "./eventList.css";

export type { EventListSortColumn } from "./eventListTable";

interface EventListProps {
  participantFilter: string;
  showCapacityColumns?: boolean;
  sortBy?: EventListSortColumn;
}

const compareByName = (a: Event, b: Event) => a.name.localeCompare(b.name);

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
        (isScheduled(a) ? a.startSlot : "").localeCompare(
          isScheduled(b) ? b.startSlot : "",
        ) || a.name.localeCompare(b.name)
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

export const EventList = ({
  participantFilter,
  showCapacityColumns = true,
  sortBy = "event",
}: EventListProps) => {
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
  const columns = showCapacityColumns
    ? eventListColumns
    : eventListColumns.filter(({ column }) => column !== "players" && column !== "maxSeats");
  const onSort = (column: EventListSortColumn) => {
    setSortDirection(getNextSortDirection(currentSortBy, column, sortDirection));
    setCurrentSortBy(column);
  };

  return (
    <table className="event-list">
      <colgroup>
        {columns.map(({ className, column }) => (
          <col className={className} key={column} />
        ))}
      </colgroup>
      <EventListHeader
        columns={columns}
        onSort={onSort}
        sortBy={currentSortBy}
        sortDirection={sortDirection}
      />
      <EventListBody
        events={sortedEvents}
        locationNamesById={locationNamesById}
        showCapacityColumns={showCapacityColumns}
      />
    </table>
  );
};
