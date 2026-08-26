import { useCallback, useContext, useMemo, useState } from "react";
import { TooManyGamesContext } from "../../context/TooManyGamesContext";
import type { AppData, Event } from "../../types";
import {
  getSchedulingErrors,
  type SchedulingError,
} from "../../scheduler/getSchedulingErrors";
import { SlotEditor } from "./SlotEditor";
import { LocationEditor } from "./LocationEditor";
import { EditorActions } from "./EditorActions";

interface EventEditorProps {
  event: Event;
  closeEditor: () => void;
}

const getDraftError = (
  events: Event[],
  eventId: Event["id"],
  location: Event["location"],
  startSlot: Event["startSlot"],
) =>
  getSchedulingErrors(
    events.map((candidate) =>
      candidate.id === eventId ? { ...candidate, location, startSlot } : candidate,
    ),
  ).get(eventId);

const ConflictWarnings = ({
  attendees,
  error,
}: {
  attendees: AppData["attendees"];
  error?: SchedulingError;
}) => {
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

export const EventEditor = ({ event, closeEditor }: EventEditorProps) => {
  const context = useContext(TooManyGamesContext);
  const [draftSlot, setDraftSlot] = useState<string | undefined>(event.startSlot);
  const [draftLocation, setDraftLocation] = useState<string | undefined>(event.location);

  const onSave = useCallback<React.SubmitEventHandler<HTMLFormElement>>(
    (submitEvent) => {
      submitEvent.preventDefault();
      if (!context) {
        throw new Error("Context missing");
      }
      context.updateEvent(event.id, { location: draftLocation, startSlot: draftSlot });
      closeEditor();
    },
    [event.id, context, draftSlot, draftLocation, closeEditor],
  );

  const data = context?.data;

  const draftError = useMemo(
    () => (data ? getDraftError(data.events, event.id, draftLocation, draftSlot) : undefined),
    [data, draftLocation, draftSlot, event.id],
  );

  if (!data) {
    return <div>loading</div>;
  }

  return (
    <form className="eventEditor" onSubmit={onSave}>
      <SlotEditor
        dates={data.dates}
        eventLength={event.length}
        setSlot={setDraftSlot}
        slot={draftSlot}
      />
      <LocationEditor
        location={draftLocation}
        locations={data.locations}
        setLocation={setDraftLocation}
      />
      <ConflictWarnings attendees={data.attendees} error={draftError} />
      <EditorActions closeEditor={closeEditor} />
    </form>
  );
};
