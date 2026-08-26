import { useTooManyGamesData } from "../../../context/useTooManyGamesData";
import "../eventList.css";
import { AttendeeSchedule } from "./AttendeeSchedule";

interface SchedulesProps {
  participantFilter: string;
}

export const Schedules = ({ participantFilter }: SchedulesProps) => {
  const context = useTooManyGamesData();
  const { data } = context;
  if (!data) {
    return "Error";
  }

  const attendees =
    participantFilter === ""
      ? data.attendees
      : data.attendees.filter((attendee) => attendee.id === participantFilter);

  return attendees.map((attendee) => (
    <AttendeeSchedule
      attendee={attendee}
      events={data.events}
      key={attendee.id}
      locations={data.locations}
    />
  ));
};
