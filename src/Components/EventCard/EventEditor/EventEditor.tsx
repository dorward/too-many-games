import { useContext, useMemo, useState } from "react";
import { tooManyGamesContext } from "../../../context/tooManyGamesContext";
import type { Event } from "../../../types";
import { SlotEditor } from "./SlotEditor";
import { LocationEditor } from "./LocationEditor";
import { EditorActions } from "./EditorActions";
import { ConflictWarnings } from "./ConflictWarnings";
import { getDraftError } from "./getDraftError";
import { PlayerEditor } from "./PlayerEditor/PlayerEditor";
import { useSaveEventEdits } from "./useSaveEventEdits";

interface EventEditorProps {
  event: Event;
  closeEditor: () => void;
}

export const EventEditor = ({ event, closeEditor }: EventEditorProps) => {
  const context = useContext(tooManyGamesContext);
  const [draftSlot, setDraftSlot] = useState<string | undefined>(event.startSlot);
  const [draftLocation, setDraftLocation] = useState<string | undefined>(event.location);
  const [draftPlayerIds, setDraftPlayerIds] = useState(event.players);

  const onSave = useSaveEventEdits(
    event,
    draftLocation,
    draftPlayerIds,
    draftSlot,
    closeEditor,
  );
  const data = context?.data;
  const draftError = useMemo(
    () =>
      data
        ? getDraftError(data.events, event.id, draftLocation, draftPlayerIds, draftSlot)
        : undefined,
    [data, draftLocation, draftPlayerIds, draftSlot, event.id],
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
      <PlayerEditor
        attendees={data.attendees}
        playerIds={draftPlayerIds}
        setPlayerIds={setDraftPlayerIds}
      />
      <ConflictWarnings attendees={data.attendees} error={draftError} />
      <EditorActions closeEditor={closeEditor} />
    </form>
  );
};
