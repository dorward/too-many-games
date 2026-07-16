import { useContext, useMemo } from "react";
import { TooManyGamesContext } from "../../context/TooManyGamesContext";
import type { Game } from "../../types";
import { Location } from "../Location/Location";
import { generateSlotIds } from "../../scheduler/generateSlotIds";
import { slotData } from "../../util/slotData";

const SLOTS_PER_DAY = 3;
const JSON_FORMAT_PADDING = 2;

interface EventEditorProps {
  event: Game;
}
export const EventEditor = ({ event }: EventEditorProps) => {
  const context = useContext(TooManyGamesContext);

  const options = useMemo(() => {
    if (!context?.data) {
      return null;
    }
    const { slots } = generateSlotIds(context.data.dates);
    return slots.map((slotId) => {
      const { dayOfWeek, time, slotNumberStr } = slotData(slotId);
      const slotNo = parseInt(slotNumberStr, 10);
      return {
        disabled: event.length + slotNo >= SLOTS_PER_DAY,
        label: `${dayOfWeek} ${time}`,
        value: slotId,
      };
    });
  }, [context?.data, event.length]);

  if (!context?.data) {
    return <div>loading</div>;
  }

  return (
    <div className="eventEditor">
      <p>Slot: {event.startSlot}</p>

      <label>
        Slot{" "}
        <select value={event.startSlot}>
          {options?.map(({ value, label }) => (
            <option key={value} value={value} label={label} />
          ))}
        </select>
      </label>

      <p>
        Location: <Location event={event} />
      </p>
      <p>Slots: {JSON.stringify(options, null, JSON_FORMAT_PADDING)}</p>
    </div>
  );
};
