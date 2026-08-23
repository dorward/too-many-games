import type { Worksheet } from "exceljs";
import type { Attendee } from "../../../types";
import { getAttendee } from "../getAttendee";
import { COLUMN_FACILITATOR, SHEET_NAME } from "./constants";

export const getEventFacilitator = (attendees: Attendee[], sheet: Worksheet, row: number) => {
  const facilitator = getAttendee(attendees, sheet, COLUMN_FACILITATOR, row);
  if (facilitator === null) {
    throw new Error(
      `Expected an attendee in cell ${COLUMN_FACILITATOR}${row} in worksheet ${SHEET_NAME}`,
    );
  }
  return facilitator;
};
