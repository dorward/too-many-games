import type { Worksheet } from "exceljs";
import type { Event } from "../../../types";
import { getNumberFromCell } from "../util/getNumberFromCell";
import { COLUMN_P_DES, COLUMN_P_MAX, COLUMN_P_MIN } from "./constants";

export const getPlayerCount = (sheet: Worksheet, row: number): Event["playerCount"] => ({
  desirable: getNumberFromCell(sheet, COLUMN_P_DES, row),
  max: getNumberFromCell(sheet, COLUMN_P_MAX, row),
  min: getNumberFromCell(sheet, COLUMN_P_MIN, row),
});
