import { parseWorkbook } from "./parseExcel/parseWorkbook";
import { parseJson } from "./parseJson";

const getExtension = (fileName: string) =>
  (/\.(?<ext>[^.]+)$/u.exec(fileName)?.groups?.ext ?? "").toLowerCase();

export const parseFile = (files: File[]) => {
  if (files.length !== 1) {
    throw new Error(`Expected 1 file but received ${files.length}`);
  }
  const [file] = files;
  const type = file.type.toLowerCase();
  const ext = getExtension(file.name);

  if (type === "application/json" || ext === "json") {
    return parseJson(file);
  }

  if (
    type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    ext === "xlsx"
  ) {
    return parseWorkbook(file);
  }

  throw new Error("Unrecognised file type");
};
