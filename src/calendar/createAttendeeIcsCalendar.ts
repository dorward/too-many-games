import type { Attendee, Event, Location } from "../types";
import { eventHasParticipant } from "../util/eventHasParticipant";
import { isScheduled } from "../util/isScheduled";

const CRLF = "\r\n";
const DEFAULT_EVENT_LENGTH = 1;
const LAST_SLOT = 3;
const SLOT_START_HOURS: Record<string, number> = {
  "1": 9,
  "2": 13,
  "3": 18,
};
const SLOT_END_HOURS: Record<string, number> = {
  "1": 12,
  "2": 16,
  "3": 21,
};

const pad = (value: number) => value.toString().padStart(2, "0");

const escapeText = (value: string) =>
  value
    .replaceAll("\\", "\\\\")
    .replaceAll(/\r\n|\r|\n/gu, "\\n")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,");

const formatDateTime = (year: string, month: string, day: string, hour: number) =>
  `${year}${month}${day}T${pad(hour)}0000`;

const formatUtcDateTime = (date: Date) =>
  `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(
    date.getUTCHours(),
  )}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;

const getEventDateTimes = (event: Event) => {
  if (event.startSlot === undefined) {
    return null;
  }

  const [year, month, day, slotNumber] = event.startSlot.split("-");
  const endSlot = Math.min(parseInt(slotNumber, 10) + event.length - DEFAULT_EVENT_LENGTH, LAST_SLOT);
  const startHour = SLOT_START_HOURS[slotNumber];
  const endHour = SLOT_END_HOURS[endSlot.toString()];
  if (startHour === undefined || endHour === undefined) {
    return null;
  }

  return {
    end: formatDateTime(year, month, day, endHour),
    start: formatDateTime(year, month, day, startHour),
  };
};

const getLocationName = (locations: Location[], event: Event) =>
  locations.find((location) => location.id === event.location)?.name ?? "";

const getEventTitle = (event: Event, attendee: Attendee) => {
  if (event.waitList.includes(attendee.id)) {
    return `${event.name} (Waitlist)`;
  }
  if (event.facilitator === attendee.id && !event.players.includes(attendee.id)) {
    return `${event.name} (Facilitator)`;
  }
  return event.name;
};

const createEventLines = (
  event: Event,
  attendee: Attendee,
  locations: Location[],
  dtstamp: string,
) => {
  const dateTimes = getEventDateTimes(event);
  if (dateTimes === null) {
    return [];
  }

  const location = getLocationName(locations, event);
  return [
    "BEGIN:VEVENT",
    `UID:${event.id}-${attendee.id}@too-many-games`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dateTimes.start}`,
    `DTEND:${dateTimes.end}`,
    `SUMMARY:${escapeText(getEventTitle(event, attendee))}`,
    location ? `LOCATION:${escapeText(location)}` : undefined,
    event.notes ? `DESCRIPTION:${escapeText(event.notes)}` : undefined,
    "END:VEVENT",
  ].filter((line): line is string => line !== undefined);
};

export const createAttendeeIcsCalendar = (
  attendee: Attendee,
  events: Event[],
  locations: Location[],
) => {
  const dtstamp = formatUtcDateTime(new Date());
  const calendarName = `${attendee.name} Too Many Games Schedule`;
  const eventLines = events
    .filter((event) => eventHasParticipant(event, attendee.id) && isScheduled(event))
    .flatMap((event) => createEventLines(event, attendee, locations, dtstamp));

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Too Many Games//Event Scheduler//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(calendarName)}`,
    ...eventLines,
    "END:VCALENDAR",
    "",
  ].join(CRLF);
};
