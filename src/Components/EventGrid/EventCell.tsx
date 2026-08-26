import type { Event } from "../../types";
import type { SchedulingError } from "../../scheduler/getSchedulingErrors";
import { EventCard } from "../EventCard/EventCard";

interface EventCellProps {
  event: Event;
  schedulingError?: SchedulingError;
}

export const EventCell = ({ event, schedulingError }: EventCellProps) => (
  <td colSpan={event.length}>
    <EventCard event={event} schedulingError={schedulingError} />
  </td>
);
