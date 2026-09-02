import ExcelJS from "exceljs";
import { parseAttendees } from "./parseAttendees";
import { parseLocations } from "./parseLocations";
import { parseEvents } from "./parseEvents";
import type { AppData } from "../../types";
import { parseDates } from "./parseDates";
import { parseRoomAllocations } from "./parseRoomAllocations";
import { validateAppDataSemantics } from "../validateAppDataSemantics";

export const parseWorkbook = async (file: File) => {
  const workbook = new ExcelJS.Workbook();
  const buffer = await file.arrayBuffer();
  await workbook.xlsx.load(buffer);
  const attendees = parseAttendees(workbook);
  const roomAllocations = parseRoomAllocations(workbook, attendees);
  const locations = parseLocations(workbook);
  const events = parseEvents(workbook, attendees, locations);
  const dates = parseDates(workbook);
  const appData: AppData = { attendees, dates, events, locations, roomAllocations };
  validateAppDataSemantics(appData);
  return appData;
};
