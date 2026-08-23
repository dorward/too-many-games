import type { Worksheet } from "exceljs";
import type { Attendee } from "../../../types";
import { getAttendee } from "../getAttendee";
import { colIdToNumber, numberToColId } from "../util/columnIds";
import { COLUMN_SIGNUP_START, SANITY_BRAKE_COLS } from "./constants";

export const getPlayers = (
  attendees: Attendee[],
  sheet: Worksheet,
  row: number,
  maxPlayers: number,
) => {
  let colId = COLUMN_SIGNUP_START;
  const players: Attendee["id"][] = [];
  const waitList: Attendee["id"][] = [];
  do {
    try {
      const id = getAttendee(attendees, sheet, colId, row);
      if (id === null) {
        break;
      }
      if (players.length === maxPlayers) {
        waitList.push(id);
      } else {
        players.push(id);
      }
      // oxlint-disable-next-line no-unused-vars
    } catch (_e: any) {
      break;
    }
    colId = numberToColId(colIdToNumber(colId) + 1);
  } while (colIdToNumber(colId) <= SANITY_BRAKE_COLS);
  return [players, waitList];
};
