import { useCallback, useMemo } from "react";
import type { AppData, Event } from "../../../types";
import { generateSlotIds } from "../../../scheduler/generateSlotIds";
import { slotData } from "../../../util/slotData";
import { SLOTS_PER_DAY } from "../../../consts";

interface SlotEditorProps {
  dates: AppData["dates"];
  eventLength: Event["length"];
  setSlot: React.Dispatch<React.SetStateAction<string | undefined>>;
  slot: Event["startSlot"];
}

export const SlotEditor = ({ dates, eventLength, setSlot, slot }: SlotEditorProps) => {
  const options = useMemo(() => {
    const { slots } = generateSlotIds(dates);
    return slots.map((slotId) => {
      const { dayOfWeek, time, slotNumberStr } = slotData(slotId);
      const slotNo = parseInt(slotNumberStr, 10);
      return {
        disabled: eventLength + slotNo > SLOTS_PER_DAY + 1,
        label: `${dayOfWeek} ${time}`,
        value: slotId,
      };
    });
  }, [dates, eventLength]);

  const onChange = useCallback<React.ChangeEventHandler<HTMLSelectElement, HTMLSelectElement>>(
    (e) => {
      setSlot(e.currentTarget.value || undefined);
    },
    [setSlot],
  );

  return (
    <label>
      Slot{" "}
      <select value={slot ?? ""} onChange={onChange}>
        <option value="">Unscheduled</option>
        {options?.map(({ value, label, disabled }) => (
          <option key={value} value={value} label={label} disabled={disabled} />
        ))}
      </select>
    </label>
  );
};
