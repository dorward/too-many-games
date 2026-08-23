import type { Worksheet } from "exceljs";
import { v4 as uuid } from "uuid";
import type { Attendee, Event, Location } from "../../../types";
import { getPlainTextFromCell } from "../util/getPlainTextFromCell";
import { COLUMN_NAME, COLUMN_NOTES } from "./constants";
import { getEventFacilitator } from "./getEventFacilitator";
import { getEventLength } from "./getEventLength";
import { getPlayerCount } from "./getPlayerCount";
import { getPlayers } from "./getPlayers";
import { getPreferredSpace } from "./getPreferredSpace";

export const parseEvent = (
  sheet: Worksheet,
  row: number,
  attendees: Attendee[],
  locations: Location[],
): Event | null => {
  const name = getPlainTextFromCell(sheet, COLUMN_NAME, row);
  if (!name) {
    return null;
  }

  const facilitator = getEventFacilitator(attendees, sheet, row);
  const length = getEventLength(sheet, row);
  const notes = getPlainTextFromCell(sheet, COLUMN_NOTES, row);
  const playerCount = getPlayerCount(sheet, row);
  const preferredSpace = getPreferredSpace(locations, sheet, row);
  const [players, waitList] = getPlayers(attendees, sheet, row, playerCount.max);

  return {
    facilitator,
    id: uuid(),
    length,
    name,
    notes,
    playerCount,
    players,
    preferredSpace,
    waitList,
  };
};
