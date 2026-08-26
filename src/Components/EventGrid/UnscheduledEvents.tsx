import type { Event } from "../../types";
import type { SchedulingErrors } from "../../scheduler/getSchedulingErrors";
import { EventComponent } from "../EventComponent/EventComponent";

interface UnscheduledEventsProps {
  schedulingErrors: SchedulingErrors;
  unscheduled: Event[];
}

export const UnscheduledEvents = ({
  schedulingErrors,
  unscheduled,
}: UnscheduledEventsProps) => {
  if (unscheduled.length === 0) {
    return null;
  }

  return (
    <>
      <h2>Unscheduled</h2>
      <ul className="unscheduled">
        {unscheduled.map((event) => (
          <li key={event.id}>
            <EventComponent event={event} schedulingError={schedulingErrors.get(event.id)} />
          </li>
        ))}
      </ul>
    </>
  );
};
