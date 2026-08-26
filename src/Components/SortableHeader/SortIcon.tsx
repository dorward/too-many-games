import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import type { SortDirection } from "./sortDirection";

interface SortIconProps {
  direction: SortDirection;
  isSorted: boolean;
}

export const SortIcon = ({ direction, isSorted }: SortIconProps) => {
  if (!isSorted) {
    return <FaSort aria-hidden="true" />;
  }

  if (direction === "asc") {
    return <FaSortUp aria-hidden="true" />;
  }

  return <FaSortDown aria-hidden="true" />;
};
