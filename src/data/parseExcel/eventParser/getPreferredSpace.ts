import type { Worksheet } from "exceljs";
import type { Location } from "../../../types";
import { getPlainTextFromCell } from "../util/getPlainTextFromCell";
import { COLUMN_SPACE } from "./constants";

export const getPreferredSpace = (locations: Location[], sheet: Worksheet, row: number) =>
  (getPlainTextFromCell(sheet, COLUMN_SPACE, row) ?? "")
    .split(",")
    .map((space) => locations.find((location) => location.name === space.trim())?.id)
    .filter((value): value is string => typeof value === "string" && value.length > 0);
