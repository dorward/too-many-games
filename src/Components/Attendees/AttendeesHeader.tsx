import { SortableHeader } from "../SortableHeader/SortableHeader";
import type { SortDirection } from "../SortableHeader/sortDirection";
import type { AttendeesSortColumn } from "./attendeesTableTypes";

interface AttendeesHeaderProps {
  onSort: (column: AttendeesSortColumn) => void;
  sortBy: AttendeesSortColumn;
  sortDirection: SortDirection;
}

export const AttendeesHeader = ({ onSort, sortBy, sortDirection }: AttendeesHeaderProps) => (
  <thead>
    <tr>
      <SortableHeader column="name" direction={sortDirection} onSort={onSort} sortBy={sortBy}>
        Name
      </SortableHeader>
      <SortableHeader column="events" direction={sortDirection} onSort={onSort} sortBy={sortBy}>
        Games
      </SortableHeader>
      <SortableHeader
        column="facilitator"
        direction={sortDirection}
        onSort={onSort}
        sortBy={sortBy}
      >
        Facilitator (non-player)
      </SortableHeader>
      <SortableHeader column="waitList" direction={sortDirection} onSort={onSort} sortBy={sortBy}>
        Wait Listed
      </SortableHeader>
    </tr>
  </thead>
);
