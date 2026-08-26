export type SortDirection = "asc" | "desc";

export const sortDirections: Record<SortDirection, number> = {
  asc: 1,
  desc: -1,
};

export const getNextSortDirection = <TColumn extends string>(
  currentSortBy: TColumn,
  nextSortBy: TColumn,
  currentDirection: SortDirection,
) => {
  if (currentSortBy !== nextSortBy) {
    return "asc";
  }

  return currentDirection === "asc" ? "desc" : "asc";
};
