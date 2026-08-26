import { useState } from "react";
import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import { eventHasParticipant } from "../../util/eventHasParticipant";
import type { Event } from "../../types";
import { getNextSortDirection, type SortDirection, sortDirections } from "../SortableHeader/sortDirection";
import { EventListBody } from "./EventListBody";
import { EventListHeader } from "./EventListHeader";
import { eventListColumns, getLocationName, type EventListSortColumn } from "./eventListTable";
import "./eventList.css";

export type { EventListSortColumn } from "./eventListTable";

interface EventListProps {
  participantFilter: string;
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
