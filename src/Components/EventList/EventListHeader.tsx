import { SortableHeader } from "../SortableHeader/SortableHeader";
import type { SortDirection } from "../SortableHeader/sortDirection";
import type { EventListColumn, EventListSortColumn } from "./eventListTable";

interface EventListHeaderProps {
  columns: EventListColumn[];
  onSort: (column: EventListSortColumn) => void;
  sortBy: EventListSortColumn;
  sortDirection: SortDirection;
}

export const EventListHeader = ({ columns, onSort, sortBy, sortDirection }: EventListHeaderProps) => (
  <thead>
    <tr>
      {columns.map(({ className, column, label }) => (
        <SortableHeader
          className={className}
          column={column}
          direction={sortDirection}
          key={column}
          onSort={onSort}
          sortBy={sortBy}
        >
          {label}
        </SortableHeader>
      ))}
    </tr>
  </thead>
);
