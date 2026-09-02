import { useContext, useMemo } from "react";
import { tooManyGamesContext } from "../../context/tooManyGamesContext";
import type { Attendee, Event } from "../../types";
import { EmptyPlayerSlots } from "./EmptyPlayerSlots/EmptyPlayerSlots";
import { getCountClassName } from "./getCountClassName";
import "./playerList.css";

interface PlayerListProps {
  additionalWaitListSlots?: number;
  errorPlayerIds?: Set<string>;
  facilitatorId: string;
  playerCount: Event["playerCount"];
  playerIds: string[];
  vertical?: boolean;
  waitListIds: string[];
}

const getPlayerLists = (
  attendees: Attendee[],
  facilitatorId: string,
  playerIds: string[],
  waitListIds: string[],
) => {
  const attendeesById = new Map(attendees.map((attendee) => [attendee.id, attendee]));
  const acceptedPlayerIds = new Set([facilitatorId, ...playerIds]);
  const getAttendees = (ids: string[]) =>
    [...new Set(ids)]
      .map((id) => attendeesById.get(id))
      .filter((player) => player !== undefined)
      .toSorted((a, b) => a.name.localeCompare(b.name));

  return {
    players: getAttendees([...acceptedPlayerIds]),
    waitList: getAttendees(waitListIds.filter((id) => !acceptedPlayerIds.has(id))),
  };
};

const getCapacityIndexes = (
  players: Attendee[],
  facilitatorId: string,
  facilitatorIsPlaying: boolean,
) => {
  const indexes = new Map<string, number>();
  players.forEach(({ id }) => {
    if (id !== facilitatorId || facilitatorIsPlaying) {
      indexes.set(id, indexes.size + 1);
    }
  });
  return indexes;
};

const getCapacityClassName = (
  capacityIndex: number | undefined,
  playerCount: Event["playerCount"],
) => (capacityIndex === undefined ? "" : getCountClassName(capacityIndex, playerCount));

export const PlayerList = ({
  additionalWaitListSlots = 0,
  errorPlayerIds,
  facilitatorId,
  playerCount,
  playerIds,
  vertical = false,
  waitListIds,
}: PlayerListProps) => {
  const context = useContext(tooManyGamesContext);
  const { players, waitList } = useMemo(
    () => getPlayerLists(context?.data?.attendees ?? [], facilitatorId, playerIds, waitListIds),
    [context?.data?.attendees, facilitatorId, playerIds, waitListIds],
  );

  const facilitatorIsPlaying = playerIds.includes(facilitatorId);
  const capacityIndexes = getCapacityIndexes(players, facilitatorId, facilitatorIsPlaying);

  return (
    <ul className={`playerList${vertical ? " vertical" : ""}`}>
      {players.map(({ name, id }) => (
        <li
          className={`player-list-item ${getCapacityClassName(capacityIndexes.get(id), playerCount)}${id === facilitatorId ? ` facilitator${facilitatorIsPlaying ? "" : " non-playing-facilitator"}` : ""}${errorPlayerIds?.has(id) ? " error" : ""}`}
          key={id}
        >
          {name}
        </li>
      ))}
      <EmptyPlayerSlots
        count={Math.max(0, playerCount.max - capacityIndexes.size)}
        playerCount={playerCount}
        startIndex={capacityIndexes.size + 1}
      />
      {waitList.map(({ name, id }, waitListIndex) => (
        <li
          className={`player-list-item ${getCountClassName(playerCount.max + 1 + waitListIndex, playerCount)}${errorPlayerIds?.has(id) ? " error" : ""}`}
          key={id}
        >
          {name}
        </li>
      ))}
      <EmptyPlayerSlots
        count={additionalWaitListSlots}
        playerCount={playerCount}
        startIndex={playerCount.max + 1 + waitList.length}
      />
    </ul>
  );
};
