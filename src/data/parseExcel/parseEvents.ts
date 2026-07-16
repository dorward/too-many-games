import type { Workbook, Worksheet } from "exceljs";
import { cellAt } from "./util/cellAt";
import { v4 as uuid } from "uuid";
import type { Attendee, Game, Location } from "../../types";
import { getPlainTextFromCell } from "./util/getPlainTextFromCell";
import { getAttendee } from "./getAttendee";
import { getNumberFromCell } from "./util/getNumberFromCell";
import { colIdToNumber, numberToColId } from "./util/columnIds";

const START_ROW = 3;
const SANITY_BRAKE_ROWS = 150;
const SANITY_BRAKE_COLS = 40;
const COLUMN_NAME = "A";
const COLUMN_NOTES = "B";
const COLUMN_LENGTH = "C";
const COLUMN_FACILITATOR = "D";
const COLUMN_SPACE = "E";
const COLUMN_P_MIN = "F";
const COLUMN_P_DES = "G";
const COLUMN_P_MAX = "H";
const COLUMN_SIGNUP_START = "I";

const getPlayers = (
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

export const parseEvents = (
  workbook: Workbook,
  attendees: Attendee[],
  locations: Location[],
) => {
  const sheet = workbook.getWorksheet("Game Scheduling");
  if (!sheet) {
    throw new Error("Could not find 'Game Scheduling' sheet");
  }

  const games: Game[] = [];

  for (let row = START_ROW; row < SANITY_BRAKE_ROWS; row++) {
    const name = getPlainTextFromCell(sheet, COLUMN_NAME, row);
    if (!name) {
      break;
    }
    const notes = getPlainTextFromCell(sheet, COLUMN_NOTES, row);
    const length = cellAt(sheet, COLUMN_LENGTH, row).value;
    if (typeof length !== "number") {
      throw new Error(
        `Expected a number in cell ${COLUMN_LENGTH}${row} in worksheet Game Scheduling`,
      );
    }
    const facilitator = getAttendee(attendees, sheet, COLUMN_FACILITATOR, row);
    const preferredSpace = (getPlainTextFromCell(sheet, COLUMN_SPACE, row) ?? "")
      .split(",")
      .map((space) => locations.find((location) => location.name === space.trim())?.id)
      .filter((value): value is string => typeof value === "string" && value.length > 0);
    const playerCount: Game["playerCount"] = {
      desirable: getNumberFromCell(sheet, COLUMN_P_DES, row),
      max: getNumberFromCell(sheet, COLUMN_P_MAX, row),
      min: getNumberFromCell(sheet, COLUMN_P_MIN, row),
    };
    const [players, waitList] = getPlayers(attendees, sheet, row, playerCount.max);
    games.push({
      facilitator,
      id: uuid(),
      length,
      name,
      notes,
      playerCount,
      players,
      preferredSpace,
      waitList,
    });
  }

  return games;
};
