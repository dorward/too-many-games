import { getAttendeeInitials } from "./getAttendeeInitials";

interface FreeTimeCellProps {
  attendeeName: string;
  isOccupied: boolean;
}

export const FreeTimeCell = ({ attendeeName, isOccupied }: FreeTimeCellProps) => (
  <td>
    {isOccupied ? (
      "-"
    ) : (
      <span
        aria-label={attendeeName}
        className="player-list-item count-within-min"
        title={attendeeName}
      >
        {getAttendeeInitials(attendeeName)}
      </span>
    )}
  </td>
);
