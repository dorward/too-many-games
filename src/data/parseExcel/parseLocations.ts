import type { Workbook } from "exceljs";
import { cellAt } from "./util/cellAt";
import { v4 as uuid } from "uuid";
import type { Location } from "../../types";

const START_ROW = 2;
const SANITY_BRAKE = 100;
const COLUMN_NAME = "A";
const COLUMN_AUTO = "B";

export const parseLocations = (workbook: Workbook) => {
  const sheet = workbook.getWorksheet("Locations");
  if (!sheet) {
    throw new Error("Could not find 'Locations' sheet");
  }

  const attendees: Location[] = [];

  for (let row = START_ROW; row < SANITY_BRAKE; row++) {
    const name = cellAt(sheet, COLUMN_NAME, row).text;
    if (!name) break;
    const autoAllocation = cellAt(sheet, COLUMN_AUTO, row).value;
    if (typeof autoAllocation !== "boolean")
      throw new Error(`Expected a boolean in cell ${COLUMN_AUTO}${row} in worksheet Locations`);
    attendees.push({ name, autoAllocation, id: uuid() });
  }

  return attendees;
};
