import { SortableHeader } from "../SortableHeader/SortableHeader";
import type { SortDirection } from "../SortableHeader/sortDirection";
import { eventListColumns, type EventListSortColumn } from "./eventListTable";

interface EventListHeaderProps {
  onSort: (column: EventListSortColumn) => void;
  sortBy: EventListSortColumn;
  sortDirection: SortDirection;
}

export const EventListHeader = ({ onSort, sortBy, sortDirection }: EventListHeaderProps) => (
  <thead>
    <tr>
      {eventListColumns.map(({ className, column, label }) => (
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
