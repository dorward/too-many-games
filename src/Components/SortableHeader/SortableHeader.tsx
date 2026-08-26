import type { SortDirection } from "./sortDirection";
import { SortIcon } from "./SortIcon";
import "./sortableTable.css";

interface SortableHeaderProps<TColumn extends string> {
  children: string;
  className?: string;
  column: TColumn;
  direction: SortDirection;
  onSort: (column: TColumn) => void;
  sortBy: TColumn;
}

const getAriaSort = (isSorted: boolean, direction: SortDirection) => {
  if (!isSorted) {
    return "none";
  }

  if (direction === "asc") {
    return "ascending";
  }

  return "descending";
};

export const SortableHeader = <TColumn extends string>({
  children,
  className,
  column,
  direction,
  onSort,
  sortBy,
}: SortableHeaderProps<TColumn>) => {
  const isSorted = sortBy === column;

  return (
    <th aria-sort={getAriaSort(isSorted, direction)} className={className}>
      <button
        className="sort-button"
        type="button"
        onClick={() => {
          onSort(column);
        }}
      >
        <span>{children}</span>
        <SortIcon direction={direction} isSorted={isSorted} />
      </button>
    </th>
  );
};
