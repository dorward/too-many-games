import type { Workbook } from "exceljs";
import type { Attendee, Event, Location } from "../../types";
import { getEventsSheet } from "./eventParser/getEventsSheet";
import { parseEvent } from "./eventParser/parseEvent";
import { SANITY_BRAKE_ROWS, START_ROW } from "./eventParser/constants";

export const parseEvents = (
  workbook: Workbook,
  attendees: Attendee[],
  locations: Location[],
) => {
  const sheet = getEventsSheet(workbook);

  const events: Event[] = [];

  for (let row = START_ROW; row < SANITY_BRAKE_ROWS; row++) {
    const event = parseEvent(sheet, row, attendees, locations);
    if (event === null) {
      break;
    }
    events.push(event);
  }

  return events;
};
