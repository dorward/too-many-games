import type { Worksheet } from "exceljs";

export const getNumberFromCell = (sheet: Worksheet, col: string, row: number): number => {
  const { value } = sheet.getCell(`${col}${row}`);
  if (typeof value !== "number")
    throw new Error(
      `Expected a number in cell ${col}${row} but got ${value} (${typeof value}})`,
    );
  return value;
};
