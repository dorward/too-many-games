import type { Game } from "../../types";
import { slotData } from "../../util/slotData";

type ScheduledTimeProps = {
  event: Game;
};

export const ScheduledTime = ({ event }: ScheduledTimeProps) => {
  if (!event.startSlot) {
    return <div className="scheduledTime">Unscheduled</div>;
  }

  const { dayOfWeek, time } = slotData(event.startSlot);

  return (
    <div className="scheduledTime">
      {dayOfWeek} {time}
    </div>
  );
};
