import type { AppData, Event } from "../../../../types";
import { AddPlayerControl } from "./AddPlayerControl";
import { PlayerEditorList } from "./PlayerEditorList";

export interface PlayerEditorProps {
  attendees: AppData["attendees"];
  playerIds: Event["players"];
  setPlayerIds: React.Dispatch<React.SetStateAction<Event["players"]>>;
}

export const PlayerEditor = ({ attendees, playerIds, setPlayerIds }: PlayerEditorProps) => (
  <fieldset className="player-editor">
    <legend>Players</legend>
    <AddPlayerControl attendees={attendees} playerIds={playerIds} setPlayerIds={setPlayerIds} />
    <PlayerEditorList attendees={attendees} playerIds={playerIds} setPlayerIds={setPlayerIds} />
  </fieldset>
);
