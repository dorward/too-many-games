import type { Attendee, SlotId } from "../../types";
import { FreeTimeBody } from "./FreeTimeBody";
import { FreeTimeHeader } from "./FreeTimeHeader";

interface FreeTimeTableProps {
  attendees: Attendee[];
  occupiedSlotIdsByAttendee: Map<string, Set<string>>;
  slots: SlotId[];
}

export const FreeTimeTable = ({
  attendees,
  occupiedSlotIdsByAttendee,
  slots,
}: FreeTimeTableProps) => (
  <table>
    <FreeTimeHeader slots={slots} />
    <FreeTimeBody
      attendees={attendees}
      occupiedSlotIdsByAttendee={occupiedSlotIdsByAttendee}
      slots={slots}
    />
  </table>
);
