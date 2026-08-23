import { useContext, useMemo } from "react";
import { TooManyGamesContext } from "../../context/TooManyGamesContext";
import "./playerList.css";

interface PlayerListProps {
  errorPlayerIds?: Set<string>;
  playerIds: string[];
}

export const PlayerList = ({ errorPlayerIds, playerIds }: PlayerListProps) => {
  const context = useContext(TooManyGamesContext);

  const players = useMemo(
    () =>
      [...new Set(playerIds)]
        .map((id) => context?.data?.attendees.find((a) => a.id === id))
        .filter((p) => p !== undefined)
        .toSorted((a, b) => a.name.localeCompare(b.name)),
    [playerIds, context?.data?.attendees],
  );

  return (
    <ul className="playerList">
      {players.map(({ name, id }) => (
        <li className={errorPlayerIds?.has(id) ? "error" : undefined} key={id}>
          {name}
        </li>
      ))}
    </ul>
  );
};
