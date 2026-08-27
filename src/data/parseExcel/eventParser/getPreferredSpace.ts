import type { Worksheet } from "exceljs";
import type { Location } from "../../../types";
import { getPlainTextFromCell } from "../util/getPlainTextFromCell";
import { COLUMN_SPACE } from "./constants";

export const getPreferredSpace = (locations: Location[], sheet: Worksheet, row: number) =>
  (getPlainTextFromCell(sheet, COLUMN_SPACE, row) ?? "")
    .split(",")
    .map((space) => space.trim())
    .filter(Boolean)
    .map((space) => {
      const location = locations.find((candidate) => candidate.name === space);
      if (!location) {
        throw new Error(
          `Could not find "${space}" from cell ${COLUMN_SPACE}${row} in the location list`,
        );
      }
      return location.id;
    });
