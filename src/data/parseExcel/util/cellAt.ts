import type { Cell, Worksheet } from "exceljs";

export const cellAt = (sheet: Worksheet, col: string, row: number): Cell => 
  sheet.getCell(`${col}${row}`)
;
