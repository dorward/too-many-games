import type { Workbook, Worksheet } from "exceljs";
import { cellAt } from "./util/cellAt";
import { v4 as uuid } from "uuid";
import type { Attendee, Event, Location } from "../../types";
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
const SHEET_NAME = "Game Scheduling";

const getEventsSheet = (workbook: Workbook) => {
  const sheet = workbook.getWorksheet(SHEET_NAME);
  if (!sheet) {
    throw new Error(`Could not find '${SHEET_NAME}' sheet`);
  }
  return sheet;
};

const getEventLength = (sheet: Worksheet, row: number) => {
  const length = cellAt(sheet, COLUMN_LENGTH, row).value;
  if (typeof length !== "number") {
    throw new Error(`Expected a number in cell ${COLUMN_LENGTH}${row} in worksheet ${SHEET_NAME}`);
  }
  return length;
};

const getEventFacilitator = (attendees: Attendee[], sheet: Worksheet, row: number) => {
  const facilitator = getAttendee(attendees, sheet, COLUMN_FACILITATOR, row);
  if (facilitator === null) {
    throw new Error(
      `Expected an attendee in cell ${COLUMN_FACILITATOR}${row} in worksheet ${SHEET_NAME}`,
    );
  }
  return facilitator;
};

const getPreferredSpace = (locations: Location[], sheet: Worksheet, row: number) =>
  (getPlainTextFromCell(sheet, COLUMN_SPACE, row) ?? "")
    .split(",")
    .map((space) => locations.find((location) => location.name === space.trim())?.id)
    .filter((value): value is string => typeof value === "string" && value.length > 0);

const getPlayerCount = (sheet: Worksheet, row: number): Event["playerCount"] => ({
  desirable: getNumberFromCell(sheet, COLUMN_P_DES, row),
  max: getNumberFromCell(sheet, COLUMN_P_MAX, row),
  min: getNumberFromCell(sheet, COLUMN_P_MIN, row),
});

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

const parseEvent = (
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
