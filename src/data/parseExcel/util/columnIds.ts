import { ALPHA_LIMIT, CHAR_CODE_A } from "../../../consts";

export const colIdToNumber = (colId: string) => {
  let num = 0;
  for (const char of colId.toUpperCase()) {
    num = num * ALPHA_LIMIT + (char.charCodeAt(0) - CHAR_CODE_A + 1);
  }
  return num;
};

export const numberToColId = (num: number) => {
  let colId = "";
  while (num > 0) {
    num--;
    colId = String.fromCharCode((num % ALPHA_LIMIT) + CHAR_CODE_A) + colId;
    num = Math.floor(num / ALPHA_LIMIT);
  }
  return colId;
};
