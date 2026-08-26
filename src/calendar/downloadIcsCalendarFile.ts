import type { Attendee, Event, Location } from "../types";
import { createAttendeeIcsCalendar } from "./createIcsCalendar";

const getCalendarFileName = (attendeeName: string) => {
  const fileName = attendeeName
    .trim()
    .replace(/[^a-z0-9]+/giu, "-")
    .replace(/^-+|-+$/gu, "")
    .toLowerCase();

  return `${fileName || "schedule"}-too-many-games.ics`;
};

export const downloadIcsCalendarFile = (
  attendee: Attendee,
  events: Event[],
  locations: Location[],
) => {
  const calendar = createAttendeeIcsCalendar(attendee, events, locations);
  const url = URL.createObjectURL(new Blob([calendar], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = getCalendarFileName(attendee.name);
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
