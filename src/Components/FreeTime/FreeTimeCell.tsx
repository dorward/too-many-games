interface FreeTimeCellProps {
  attendeeName: string;
  isOccupied: boolean;
}

export const FreeTimeCell = ({ attendeeName, isOccupied }: FreeTimeCellProps) => (
  <td>
    {isOccupied ? (
      "-"
    ) : (
      <span className="player-list-item count-within-min">{attendeeName}</span>
    )}
  </td>
);
