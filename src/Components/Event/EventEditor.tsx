import { useCallback, useContext, useState } from "react";
import { TooManyGamesContext } from "../../context/TooManyGamesContext";
import type { Event } from "../../types";
import { FaCheck } from "react-icons/fa";
import { SlotEditor } from "./SlotEditor";
import { LocationEditor } from "./LocationEditor";

interface EventEditorProps {
  event: Event;
  closeEditor: () => void;
}

// TODO: Add local conflict warnings

export const EventEditor = ({ event, closeEditor }: EventEditorProps) => {
  const context = useContext(TooManyGamesContext);
  const [draftSlot, setDraftSlot] = useState<string | undefined>(event.startSlot);
  const [draftLocation, setDraftLocation] = useState<string | undefined>(event.location);

  const onSave = useCallback(() => {
    if (!context) {
      throw new Error("Context missing");
    }
    context.updateEvent(event.id, { location: draftLocation, startSlot: draftSlot });
    closeEditor();
  }, [event.id, context, draftSlot, draftLocation, closeEditor]);

  if (!context?.data) {
    return <div>loading</div>;
  }

  return (
    <div className="eventEditor">
      <SlotEditor dates={context.data.dates} event={event} setSlot={setDraftSlot} />
      <LocationEditor
        locations={context.data.locations}
        event={event}
        setLocation={setDraftLocation}
      />
      <button aria-label="Save" title="Save" onClick={onSave}>
        <FaCheck />
      </button>
    </div>
  );
};

//
