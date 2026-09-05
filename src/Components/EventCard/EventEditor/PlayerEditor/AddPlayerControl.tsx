import { useCallback, useState } from "react";
import { FaPlus } from "react-icons/fa";
import type { PlayerEditorProps } from "./PlayerEditor";

export const AddPlayerControl = ({ attendees, playerIds, setPlayerIds }: PlayerEditorProps) => {
  const [selectedAttendeeId, setSelectedAttendeeId] = useState("");
  const playerIdSet = new Set(playerIds);
  const availableAttendees = attendees
    .filter(({ id }) => !playerIdSet.has(id))
    .toSorted((a, b) => a.name.localeCompare(b.name));
  const selectAttendee = useCallback<React.ChangeEventHandler<HTMLSelectElement>>(
    (event) => {
      setSelectedAttendeeId(event.currentTarget.value);
    },
    [],
  );

  const addPlayer = useCallback(() => {
    if (selectedAttendeeId === "") {
      return;
    }
    setPlayerIds((currentPlayerIds) =>
      currentPlayerIds.includes(selectedAttendeeId)
        ? currentPlayerIds
        : [...currentPlayerIds, selectedAttendeeId],
    );
    setSelectedAttendeeId("");
  }, [selectedAttendeeId, setPlayerIds]);

  return (
    <div className="player-editor-add">
      <label>
        Add player
        <select value={selectedAttendeeId} onChange={selectAttendee}>
          <option value="">Select attendee</option>
          {availableAttendees.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <button
        aria-label="Add attendee to game"
        disabled={selectedAttendeeId === ""}
        onClick={addPlayer}
        title="Add attendee"
        type="button"
      >
        <FaPlus />
      </button>
    </div>
  );
};
