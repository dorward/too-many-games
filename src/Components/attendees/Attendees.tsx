import { useState } from "react";
import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import { eventsPerAttendee } from "../../data/derive/eventsPerAttendee";
import type { Attendee } from "../../types";
import { SortableHeader } from "../sortable-table/SortableHeader";
import { getNextSortDirection, type SortDirection, sortDirections } from "../sortable-table/sortDirection";
import "./attendees.css";

type AttendeesSortColumn = "events" | "name" | "waitList";

interface AttendeeRow {
  attendee: Attendee;
  events: number;
  waitList: number;
}

interface AttendeesHeaderProps {
  onSort: (column: AttendeesSortColumn) => void;
  sortBy: AttendeesSortColumn;
  sortDirection: SortDirection;
}

interface AttendeesBodyProps {
  attendees: AttendeeRow[];
}

const compareByAttendeeName = (a: AttendeeRow, b: AttendeeRow) =>
  a.attendee.name.localeCompare(b.attendee.name);

const sortAttendees = (
  attendees: AttendeeRow[],
  sortBy: AttendeesSortColumn,
  direction: SortDirection,
) =>
  attendees.toSorted((a, b) => {
    const directionModifier = sortDirections[direction];

    if (sortBy === "events") {
      return directionModifier * (a.events - b.events || compareByAttendeeName(a, b));
    }

    if (sortBy === "waitList") {
      return directionModifier * (a.waitList - b.waitList || compareByAttendeeName(a, b));
    }

    return directionModifier * compareByAttendeeName(a, b);
  });

const AttendeesHeader = ({ onSort, sortBy, sortDirection }: AttendeesHeaderProps) => (
  <thead>
    <tr>
      <SortableHeader
        column="name"
        direction={sortDirection}
        onSort={onSort}
        sortBy={sortBy}
      >
        Name
      </SortableHeader>
      <SortableHeader
        column="events"
        direction={sortDirection}
        onSort={onSort}
        sortBy={sortBy}
      >
        Games
      </SortableHeader>
      <SortableHeader
        column="waitList"
        direction={sortDirection}
        onSort={onSort}
        sortBy={sortBy}
      >
        Wait Listed
      </SortableHeader>
    </tr>
  </thead>
);

const AttendeesBody = ({ attendees }: AttendeesBodyProps) => (
  <tbody>
    {attendees.map(({ attendee, events, waitList }) => (
      <tr key={attendee.id}>
        <td>{attendee.name}</td>
        <td>{events}</td>
        <td>{waitList}</td>
      </tr>
    ))}
  </tbody>
);

export const Attendees = () => {
  const [sortBy, setSortBy] = useState<AttendeesSortColumn>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const context = useTooManyGamesData();
  const { data } = context;
  if (!data) {
    return "Error";
  }

  const attendeeRows = data.attendees.map((attendee) => {
    const { events, waitList } = eventsPerAttendee(attendee, data);

    return { attendee, events, waitList };
  });
  const sortedAttendees = sortAttendees(attendeeRows, sortBy, sortDirection);
  const onSort = (column: AttendeesSortColumn) => {
    setSortDirection(getNextSortDirection(sortBy, column, sortDirection));
    setSortBy(column);
  };

  return (
    <table className="attendees">
      <AttendeesHeader onSort={onSort} sortBy={sortBy} sortDirection={sortDirection} />
      <AttendeesBody attendees={sortedAttendees} />
    </table>
  );
};
