import type { Worksheet } from "exceljs";
import { getPlainText } from "./getPlainText";

export const getPlainTextFromCell = (sheet: Worksheet, col: string, row: number): string => {
  const { text } = sheet.getCell(`${col}${row}`);
  return getPlainText(text);
};
