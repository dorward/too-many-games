import type { SlotId } from "../../types";
import { SLOTS_PER_DAY } from "../../consts";
import { DayLabel } from "./DayLabel";
import { groupSlotsByDay } from "./groupSlotsByDay";
import { SlotLabel } from "./SlotLabel";

interface FreeTimeHeaderProps {
  slots: SlotId[];
}

export const FreeTimeHeader = ({ slots }: FreeTimeHeaderProps) => {
  const slotsByDay = groupSlotsByDay(slots);
  return (
    <thead>
      <tr>
        <th className="free-time-attendee-heading" rowSpan={2} scope="col">
          Attendee
        </th>
        {slotsByDay.map(([day]) => (
          <th colSpan={SLOTS_PER_DAY} key={day} scope="colgroup">
            <DayLabel day={day} />
          </th>
        ))}
      </tr>
      <tr>
        {slots.map((slotId) => (
          <th key={slotId} scope="col">
            <SlotLabel slotId={slotId} />
          </th>
        ))}
      </tr>
    </thead>
  );
};
