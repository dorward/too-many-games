import type { Workbook } from "exceljs";
import { v4 as uuid } from "uuid";
import type { Attendee } from "../../types";
import { getPlainTextFromCell } from "./util/getPlainTextFromCell";

const START_ROW = 2;
const SANITY_BRAKE = 100;
const COLUMN = "V";

export const parseAttendees = (workbook: Workbook) => {
  const sheet = workbook.getWorksheet("Attendees");
  if (!sheet) {
    throw new Error("Could not find 'Attendees' sheet");
  }

  const attendees: Attendee[] = [];

  for (let row = START_ROW; row < SANITY_BRAKE; row++) {
    const name = getPlainTextFromCell(sheet, COLUMN, row);
    if (!name) {break;}
    attendees.push({ id: uuid(), name });
  }

  return attendees;
};
