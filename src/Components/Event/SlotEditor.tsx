import { useCallback, useMemo } from "react";
import type { AppData, Event } from "../../types";
import { generateSlotIds } from "../../scheduler/generateSlotIds";
import { slotData } from "../../util/slotData";
import { SLOTS_PER_DAY } from "../../consts";

interface SlotEditorProps {
  dates: AppData["dates"];
  event: Event;
  setSlot: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const SlotEditor = ({ dates, event, setSlot }: SlotEditorProps) => {
  const options = useMemo(() => {
    const { slots } = generateSlotIds(dates);
    return slots.map((slotId) => {
      const { dayOfWeek, time, slotNumberStr } = slotData(slotId);
      const slotNo = parseInt(slotNumberStr, 10);
      console.log({ disabled: event.length + slotNo >= SLOTS_PER_DAY, slotNo });
      return {
        disabled: event.length + slotNo > SLOTS_PER_DAY + 1,
        label: `${dayOfWeek} ${time}`,
        value: slotId,
      };
    });
  }, [dates, event.length]);

  const onChange = useCallback<React.ChangeEventHandler<HTMLSelectElement, HTMLSelectElement>>(
    (e) => {
      setSlot(e.currentTarget.value);
    },
    [setSlot],
  );

  return (
    <label>
      Slot{" "}
      <select value={event.startSlot} onChange={onChange}>
        {options?.map(({ value, label, disabled }) => (
          <option key={value} value={value} label={label} disabled={disabled} />
        ))}
      </select>
    </label>
  );
};
