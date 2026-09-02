import type { Attendee, SlotId } from "../../types";
import { FreeTimeCell } from "./FreeTimeCell";

interface FreeTimeRowProps {
  attendee: Attendee;
  occupiedSlotIds?: Set<string>;
  slots: SlotId[];
}

export const FreeTimeRow = ({ attendee, occupiedSlotIds, slots }: FreeTimeRowProps) => (
  <tr>
    <th scope="row">{attendee.name}</th>
    {slots.map((slotId) => (
      <FreeTimeCell
        attendeeName={attendee.name}
        isOccupied={occupiedSlotIds?.has(slotId) ?? false}
        key={slotId}
      />
    ))}
  </tr>
);
