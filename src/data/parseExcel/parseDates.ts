import type { Workbook } from "exceljs";
import type { Dates } from "../../types";

export const parseDates = (workbook: Workbook): Dates => {
  const sheet = workbook.getWorksheet("Welcome & Information");
  if (!sheet) {
    throw new Error("Could not find 'Welcome & Information' sheet");
  }
  const start = sheet.getCell("B4").value;
  if (!(start instanceof Date))
    throw new Error(`Expected to find a Date in cell B4 but found ${start}`);
  const end = sheet.getCell("B5").value;
  if (!(end instanceof Date))
    throw new Error(`Expected to find a Date in cell B5 but found ${end}`);
  return { start, end };
};
