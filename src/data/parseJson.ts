// oxlint-disable typescript/no-unsafe-argument typescript/no-unsafe-assignment typescript/no-unsafe-member-access
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { type AppData, appDataSchema } from "../types";
import { validateAppDataSemantics } from "./validateAppDataSemantics";

const ajv = new Ajv();
addFormats(ajv);
const validateAppData = ajv.compile(appDataSchema);

const parseAppData = (input: string): AppData => {
  const json: unknown = JSON.parse(input);
  const parsed =
    json !== null &&
    typeof json === "object" &&
    !Array.isArray(json) &&
    !("roomAllocations" in json)
      ? { ...json, roomAllocations: [] }
      : json;

  if (!validateAppData(parsed)) {
    throw new Error(`Invalid AppData: ${ajv.errorsText(validateAppData.errors)}`);
  }

  const appData: AppData = {
    ...parsed,
    dates: {
      end: new Date(parsed.dates.end),
      start: new Date(parsed.dates.start),
    },
    roomAllocations: parsed.roomAllocations,
  };
  validateAppDataSemantics(appData);
  return appData;
};

export const parseJson = async (file: File): Promise<AppData> => {
  const text = await file.text();
  return parseAppData(text);
};
