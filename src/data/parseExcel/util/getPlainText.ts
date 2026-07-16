import type { CellHyperlinkValue, CellValue, RichText } from "exceljs";

type Input = CellValue | RichText[] | RichText;

const isHyperlink = (input: Input): input is CellHyperlinkValue =>
  input !== null && typeof input === "object" && "text" in input && "hyperlink" in input;

/**
 * Extracts plain text from an ExcelJS cell value, handling different cell formats.
 *
 * @param input - Value returned by `worksheet.getCell(...).value` (subset handled).
 * @returns A plain string.
 *
 * @throws Will throw an error if the input type is not recognized.
 *
 * @example
 * getPlainText("John Doe"); // "John Doe"
 * getPlainText({ richText: [{ text: "John" }, { text: " Doe" }] }); // "John Doe"
 */
export const getPlainText = (input: Input): string => {
  if (input === null) {
    return "";
  }
  if (typeof input === "undefined") {
    return "";
  }
  if (typeof input === "number") {
    return `${input}`;
  }
  if (typeof input === "boolean") {
    return `${input}`;
  }
  if (typeof input === "string") {
    return input;
  } else if (Array.isArray(input)) {
    const result = input.map((x) => getPlainText(x));
    return result.join(" ");
  } else if ("text" in input && typeof input.text === "string") {
    return input.text;
  } else if ("richText" in input && Array.isArray(input.richText)) {
    return getPlainText(input.richText);
  } else if (isHyperlink(input)) {
    return input.hyperlink;
  }
  console.error(input);
  throw new Error(`Unexpected value`);
};
