import type { Attendee, SlotId } from "../../types";
import { FreeTimeRow } from "./FreeTimeRow";

interface FreeTimeBodyProps {
  attendees: Attendee[];
  occupiedSlotIdsByAttendee: Map<string, Set<string>>;
  slots: SlotId[];
}

export const FreeTimeBody = ({
  attendees,
  occupiedSlotIdsByAttendee,
  slots,
}: FreeTimeBodyProps) => (
  <tbody>
    {attendees.map((attendee) => (
      <FreeTimeRow
        attendee={attendee}
        key={attendee.id}
        occupiedSlotIds={occupiedSlotIdsByAttendee.get(attendee.id)}
        slots={slots}
      />
    ))}
  </tbody>
);
