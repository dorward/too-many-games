import { FaDownload } from "react-icons/fa";
import { downloadIcsCalendarFile } from "../../../calendar/downloadIcsCalendarFile";
import type { Attendee, Event, Location } from "../../../types";
import { eventHasParticipant } from "../../../util/eventHasParticipant";
import { isScheduled } from "../../../util/isScheduled";
import { EventList } from "../EventList";

interface AttendeeScheduleProps {
  attendee: Attendee;
  events: Event[];
  locations: Location[];
}

export const AttendeeSchedule = ({ attendee, events, locations }: AttendeeScheduleProps) => {
  const hasEvents = events.some(
    (event) => eventHasParticipant(event, attendee.id) && isScheduled(event),
  );

  return (
    <section className="schedule">
      <header>
        <h2>{attendee.name}</h2>
        {hasEvents && (
          <button
            aria-label={`Download ${attendee.name}'s schedule as an iCal file`}
            title="Download iCal file"
            onClick={() => {
              downloadIcsCalendarFile(attendee, events, locations);
            }}
          >
            <FaDownload />
          </button>
        )}
      </header>
      <EventList participantFilter={attendee.id} showCapacityColumns={false} sortBy="scheduled" />
    </section>
  );
};
