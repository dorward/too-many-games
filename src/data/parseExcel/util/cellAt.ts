import type { Cell, Worksheet } from "exceljs";

export const cellAt = (sheet: Worksheet, col: string, row: number): Cell => {
  return sheet.getCell(`${col}${row}`);
};
