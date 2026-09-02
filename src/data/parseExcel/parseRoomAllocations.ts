import type { Workbook, Worksheet } from "exceljs";
import type { Attendee, BedLayout, RoomAllocation, RoomNumber } from "../../types";

const ATTENDEE_COLUMN = 9;
const SECOND_ATTENDEE_COLUMN = 10;
const ROOM_COLUMN = 8;
const ROOM_HEADER = /^Room\s*(?<roomNumber>\d+)\s*-/iu;
const ROOM_NUMBER_MIN = 1;
const ROOM_NUMBER_MAX = 17;

interface RoomInProgress {
  layout: BedLayout | null;
  occupantIds: [string | null, string | null];
  roomNumber: RoomNumber;
}

const normaliseName = (name: string) => name.trim().replaceAll(/\s+/gu, " ").toLocaleLowerCase();

const isRoomNumber = (roomNumber: number): roomNumber is RoomNumber =>
  Number.isInteger(roomNumber) &&
  roomNumber >= ROOM_NUMBER_MIN &&
  roomNumber <= ROOM_NUMBER_MAX;

const getAttendeesByName = (attendees: Attendee[]) => {
  const attendeesByName = new Map<string, Attendee | null>();
  for (const attendee of attendees) {
    const name = normaliseName(attendee.name);
    attendeesByName.set(name, attendeesByName.has(name) ? null : attendee);
  }
  return attendeesByName;
};

const getOccupantId = (
  sheet: Worksheet,
  row: number,
  column: number,
  attendeesByName: Map<string, Attendee | null>,
) => {
  const cell = sheet.getCell(row, column);
  const name = cell.text.trim();
  if (name.length === 0) {
    return null;
  }

  const attendee = attendeesByName.get(normaliseName(name));
  if (attendee === null) {
    throw new Error(`Ambiguous attendee name "${name}" in cell ${cell.address}`);
  }
  if (attendee === undefined) {
    throw new Error(`Could not find attendee "${name}" from cell ${cell.address}`);
  }
  return attendee.id;
};

const getRoomNumber = (heading: string): RoomNumber | null => {
  const match = ROOM_HEADER.exec(heading);
  if (!match?.groups) {
    return null;
  }
  const roomNumber = Number(match.groups.roomNumber);
  if (!isRoomNumber(roomNumber)) {
    throw new Error(`Room number ${roomNumber} is outside the supported range`);
  }
  return roomNumber;
};

const completeRoom = (room: RoomInProgress | null, rooms: RoomAllocation[]) => {
  if (room === null) {
    return;
  }
  if (room.layout === null) {
    throw new Error(`Could not determine the bed layout for Room ${room.roomNumber}`);
  }
  rooms.push({ ...room, layout: room.layout });
};

const setLayout = (room: RoomInProgress, layout: BedLayout) => {
  if (room.layout !== null && room.layout !== layout) {
    throw new Error(`Room ${room.roomNumber} contains conflicting bed layouts`);
  }
  room.layout = layout;
};

const assertSecondAttendeeCellIsEmpty = (
  sheet: Worksheet,
  row: number,
  roomNumber: RoomNumber,
  bedLabel: string,
) => {
  const cell = sheet.getCell(row, SECOND_ATTENDEE_COLUMN);
  if (cell.text.trim().length > 0) {
    throw new Error(`Room ${roomNumber} has too many occupants in ${bedLabel}`);
  }
};

const parseBedRow = (
  sheet: Worksheet,
  row: number,
  bedLabel: string,
  room: RoomInProgress,
  attendeesByName: Map<string, Attendee | null>,
) => {
  const firstOccupant = () => getOccupantId(sheet, row, ATTENDEE_COLUMN, attendeesByName);
  if (bedLabel === "Double Bed") {
    setLayout(room, "double");
    room.occupantIds = [
      firstOccupant(),
      getOccupantId(sheet, row, SECOND_ATTENDEE_COLUMN, attendeesByName),
    ];
  } else if (bedLabel === "Single Bed") {
    setLayout(room, "single");
    room.occupantIds = [firstOccupant(), null];
    assertSecondAttendeeCellIsEmpty(sheet, row, room.roomNumber, bedLabel);
  } else if (bedLabel === "Single Bed 1" || bedLabel === "Single Bed 2") {
    setLayout(room, "twin");
    const bedIndex = bedLabel === "Single Bed 1" ? 0 : 1;
    room.occupantIds[bedIndex] = firstOccupant();
    assertSecondAttendeeCellIsEmpty(sheet, row, room.roomNumber, bedLabel);
  }
};

export const parseRoomAllocations = (workbook: Workbook, attendees: Attendee[]) => {
  const sheet = workbook.getWorksheet("Attendees");
  if (!sheet) {
    throw new Error("Could not find 'Attendees' sheet");
  }

  const attendeesByName = getAttendeesByName(attendees);
  const rooms: RoomAllocation[] = [];
  let currentRoom: RoomInProgress | null = null;

  for (let row = 1; row <= sheet.rowCount; row++) {
    const bedOrRoom = sheet.getCell(row, ROOM_COLUMN).text.trim();
    const roomNumber = getRoomNumber(bedOrRoom);
    if (roomNumber !== null) {
      completeRoom(currentRoom, rooms);
      currentRoom = { layout: null, occupantIds: [null, null], roomNumber };
    } else if (currentRoom !== null) {
      parseBedRow(sheet, row, bedOrRoom, currentRoom, attendeesByName);
    }
  }

  completeRoom(currentRoom, rooms);
  return rooms;
};
