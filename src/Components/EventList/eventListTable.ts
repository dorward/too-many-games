import type { Event } from "../../types";

export type EventListSortColumn = "event" | "location" | "maxSeats" | "players" | "scheduled";

export interface EventListColumn {
  className: string;
  column: EventListSortColumn;
  label: string;
}

export const eventListColumns: EventListColumn[] = [
  { className: "event-list-event", column: "event", label: "Event" },
  { className: "event-list-players", column: "players", label: "Players" },
  { className: "event-list-max-seats", column: "maxSeats", label: "Max Seats" },
  { className: "event-list-scheduled", column: "scheduled", label: "Scheduled" },
  { className: "event-list-location", column: "location", label: "Location" },
];

export const getLocationName = (event: Event, locationNamesById: Map<string, string>) =>
  locationNamesById.get(event.location ?? "") ?? "Unscheduled";
