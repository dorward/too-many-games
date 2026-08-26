import type { Event } from "../../types";
import type { SchedulingError } from "../../scheduler/getSchedulingErrors";
import { EventComponent } from "../EventComponent/EventComponent";

interface EventCellProps {
  event: Event;
  schedulingError?: SchedulingError;
}

export const EventCell = ({ event, schedulingError }: EventCellProps) => (
  <td colSpan={event.length}>
    <EventComponent event={event} schedulingError={schedulingError} />
  </td>
);
