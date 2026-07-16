import { ALPHA_LIMIT, CHAR_CODE_A } from "../../../consts";

/**
 * Generates an ExcelJS cell ID based on the given row and column.
 *
 * Converts a zero-based column index into its corresponding uppercase letter
 * sequence (A = 0, B = 1, ..., Z = 25, AA = 26, ...) and concatenates it with
 * the row number to form a cell identifier like "A1", "B2", or "AA3".
 *
 * @param row - The row number (1-based).
 * @param colCode - The zero-based column index (0 for 'A', 1 for 'B', etc.).
 * @returns The generated cell ID (e.g., "A1", "B2", "AA3").
 *
 * @example
 * getCellID(1, 0); // "A1"
 * getCellID(3, 2); // "C3"
 */

export const getCellID = (row: number, colCode: number): string => {
  let index = colCode;
  let columnName = "";

  do {
    columnName = String.fromCharCode(CHAR_CODE_A + (index % ALPHA_LIMIT)) + columnName;
    index = Math.floor(index / ALPHA_LIMIT) - 1;
  } while (index >= 0);

  return `${columnName}${row}`;
};
