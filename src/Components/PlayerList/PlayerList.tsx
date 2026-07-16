import { useContext, useMemo } from "react";
import { TooManyGamesContext } from "../../context/TooManyGamesContext";
import "./playerList.css";

interface PlayerListProps {
  playerIds: string[];
}

export const PlayerList = ({ playerIds }: PlayerListProps) => {
  const context = useContext(TooManyGamesContext);

  const players = useMemo(
    () =>
      [...new Set(playerIds)]
        .map((id) => context?.data?.attendees.find((a) => a.id === id))
        .filter((p) => p !== undefined),
    [playerIds, context?.data?.attendees],
  );

  return (
    <ul className="playerList">
      {players.map(({ name, id }) => (
        <li key={id}>{name}</li>
      ))}
    </ul>
  );
};
