import type { Workbook } from "exceljs";
import { SHEET_NAME } from "./constants";

export const getEventsSheet = (workbook: Workbook) => {
  const sheet = workbook.getWorksheet(SHEET_NAME);
  if (!sheet) {
    throw new Error(`Could not find '${SHEET_NAME}' sheet`);
  }
  return sheet;
};
