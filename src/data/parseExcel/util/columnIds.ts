export const colIdToNumber = (colId: string) => {
  let num = 0;
  for (const char of colId.toUpperCase()) {
    num = num * 26 + (char.charCodeAt(0) - 64);
  }
  return num;
};

export const numberToColId = (num: number) => {
  let colId = "";
  while (num > 0) {
    num--;
    colId = String.fromCharCode((num % 26) + 65) + colId;
    num = Math.floor(num / 26);
  }
  return colId;
};
