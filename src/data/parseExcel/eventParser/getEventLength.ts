import type { Worksheet } from "exceljs";
import { cellAt } from "../util/cellAt";
import { COLUMN_LENGTH, SHEET_NAME } from "./constants";

export const getEventLength = (sheet: Worksheet, row: number) => {
  const length = cellAt(sheet, COLUMN_LENGTH, row).value;
  if (typeof length !== "number") {
    throw new Error(`Expected a number in cell ${COLUMN_LENGTH}${row} in worksheet ${SHEET_NAME}`);
  }
  return length;
};
