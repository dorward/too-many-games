import type { Worksheet } from "exceljs";
import type { Attendee } from "../../types";
import { cellAt } from "./util/cellAt";

export const getAttendee = (
  attendees: Attendee[],
  sheet: Worksheet,
  col: string,
  row: number,
): string | null => {
  const cell = cellAt(sheet, col, row);
  const { text } = cell;
  if (!text) {
    return null;
  }
  const attendee = attendees.find((a) => a.name === text);
  if (!attendee) {
    throw new Error(`Could not find ${text} in attendee list`);
  }
  return attendee.id;
};
