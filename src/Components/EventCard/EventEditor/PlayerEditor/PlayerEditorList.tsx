import { FaTrash } from "react-icons/fa";
import type { PlayerEditorProps } from "./PlayerEditor";

export const PlayerEditorList = ({
  attendees,
  playerIds,
  setPlayerIds,
}: PlayerEditorProps) => {
  const attendeesById = new Map(attendees.map((attendee) => [attendee.id, attendee]));

  if (playerIds.length === 0) {
    return <p>No players added.</p>;
  }

  return (
    <ul className="player-editor-list">
      {playerIds.map((playerId) => (
        <li key={playerId}>
          <span>{attendeesById.get(playerId)?.name ?? "Unknown attendee"}</span>
          <button
            aria-label={`Remove ${attendeesById.get(playerId)?.name ?? "attendee"} from game`}
            className="modal-close-button"
            onClick={() => {
              setPlayerIds((currentPlayerIds) =>
                currentPlayerIds.filter((id) => id !== playerId),
              );
            }}
            title="Remove attendee"
            type="button"
          >
            <FaTrash />
          </button>
        </li>
      ))}
    </ul>
  );
};
