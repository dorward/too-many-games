import type { Attendee } from "../../types";

export type AttendeesSortColumn = "events" | "facilitator" | "name" | "waitList";

export interface AttendeeRow {
  attendee: Attendee;
  events: number;
  facilitator: number;
  waitList: number;
}
