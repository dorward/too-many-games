import type { SlotId } from "../../types";
import { SlotLabel } from "./SlotLabel";

interface FreeTimeHeaderProps {
  slots: SlotId[];
}

export const FreeTimeHeader = ({ slots }: FreeTimeHeaderProps) => (
  <thead>
    <tr>
      <th scope="col">Attendee</th>
      {slots.map((slotId) => (
        <th key={slotId} scope="col">
          <SlotLabel slotId={slotId} />
        </th>
      ))}
    </tr>
  </thead>
);
