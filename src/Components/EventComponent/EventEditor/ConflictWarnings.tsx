import type { AppData } from "../../../types";
import type { SchedulingError } from "../../../scheduler/getSchedulingErrors";

interface ConflictWarningsProps {
  attendees: AppData["attendees"];
  error?: SchedulingError;
}

export const ConflictWarnings = ({ attendees, error }: ConflictWarningsProps) => {
  const participantNames = attendees
    .filter((attendee) => error?.participantIds.has(attendee.id))
    .map((attendee) => attendee.name);

  return (
    <>
      {error?.location && (
        <p className="conflictWarning" role="alert">
          The selected location is already in use at this time.
        </p>
      )}
      {participantNames.length > 0 && (
        <p className="conflictWarning" role="alert">
          Already scheduled at this time: {participantNames.join(", ")}.
        </p>
      )}
    </>
  );
};
