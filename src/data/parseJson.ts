// oxlint-disable typescript/no-unsafe-argument typescript/no-unsafe-member-access
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { type AppData, appDataSchema } from "../types";

const ajv = new Ajv();
addFormats(ajv);
const validateAppData = ajv.compile(appDataSchema);

const parseAppData = (input: string): AppData => {
  const parsed: unknown = JSON.parse(input);

  if (!validateAppData(parsed)) {
    throw new Error(`Invalid AppData: ${ajv.errorsText(validateAppData.errors)}`);
  }

  return {
    ...parsed,
    dates: {
      end: new Date(parsed.dates.end),
      start: new Date(parsed.dates.start),
    },
  };
};

export const parseJson = async (file: File): Promise<AppData> => {
  const text = await file.text();
  return parseAppData(text);
};
