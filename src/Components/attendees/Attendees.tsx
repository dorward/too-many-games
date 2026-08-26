import { useState } from "react";
import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import { eventsPerAttendee } from "../../data/derive/eventsPerAttendee";
import { getNextSortDirection, type SortDirection, sortDirections } from "../SortableHeader/sortDirection";
import { AttendeesBody } from "./AttendeesBody";
import { AttendeesHeader } from "./AttendeesHeader";
import type { AttendeeRow, AttendeesSortColumn } from "./attendeesTableTypes";
import "./attendees.css";

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

    if (sortBy === "facilitator") {
      return directionModifier * (a.facilitator - b.facilitator || compareByAttendeeName(a, b));
    }

    if (sortBy === "waitList") {
      return directionModifier * (a.waitList - b.waitList || compareByAttendeeName(a, b));
    }

    return directionModifier * compareByAttendeeName(a, b);
  });

export const Attendees = () => {
  const [sortBy, setSortBy] = useState<AttendeesSortColumn>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const context = useTooManyGamesData();
  const { data } = context;
  if (!data) {
    return "Error";
  }

  const attendeeRows = data.attendees.map((attendee) => {
    const { events, facilitator, waitList } = eventsPerAttendee(attendee, data);

    return { attendee, events, facilitator, waitList };
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
