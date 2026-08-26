import type { Event } from "../../types";
import { slotData } from "../../util/slotData";

interface ScheduledTimeProps {
  event: Event;
}

export const ScheduledTime = ({ event }: ScheduledTimeProps) => {
  if (event.startSlot === undefined) {
    return <div className="scheduledTime">Unscheduled</div>;
  }

  const { dayOfWeek, time } = slotData(event.startSlot);

  return (
    <div className="scheduledTime">
      {dayOfWeek} {time}
    </div>
  );
};
