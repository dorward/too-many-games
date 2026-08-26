import { useContext, useMemo } from "react";
import { TooManyGamesContext } from "../../context/TooManyGamesContext";
import type { Attendee, Event } from "../../types";
import "./playerList.css";

interface PlayerListProps {
  errorPlayerIds?: Set<string>;
  facilitatorId: string;
  playerCount: Event["playerCount"];
  playerIds: string[];
  waitListIds: string[];
}

const getCountClassName = (index: number, playerCount: Event["playerCount"]) => {
  if (index <= playerCount.min) {
    return "count-within-min";
  }
  if (index <= playerCount.desirable) {
    return "count-within-desirable";
  }
  if (index <= playerCount.max) {
    return "count-within-max";
  }
  return "count-waitlisted";
};

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

export const PlayerList = ({
  errorPlayerIds,
  facilitatorId,
  playerCount,
  playerIds,
  waitListIds,
}: PlayerListProps) => {
  const context = useContext(TooManyGamesContext);

  const { players, waitList } = useMemo(
    () => getPlayerLists(context?.data?.attendees ?? [], facilitatorId, playerIds, waitListIds),
    [context?.data?.attendees, facilitatorId, playerIds, waitListIds],
  );

  const facilitatorIsPlaying = playerIds.includes(facilitatorId);
  const countIndexOffset = facilitatorIsPlaying ? 1 : 0;
  const emptyPlayerCount = Math.max(0, playerCount.max + 1 - countIndexOffset - players.length);

  return (
    <ul className="playerList">
      {players.map(({ name, id }, index) => (
        <li
          className={`${getCountClassName(index + countIndexOffset, playerCount)}${id === facilitatorId ? ` facilitator${facilitatorIsPlaying ? "" : " non-playing-facilitator"}` : ""}${errorPlayerIds?.has(id) ? " error" : ""}`}
          key={id}
        >
          {name}
        </li>
      ))}
      {Array.from({ length: emptyPlayerCount }, (_, emptyIndex) => {
        const index = players.length + emptyIndex + countIndexOffset;
        return (
          <li
            aria-hidden="true"
            className={getCountClassName(index, playerCount)}
            key={`empty-player-${index}`}
          />
        );
      })}
      {waitList.map(({ name, id }, waitListIndex) => (
        <li
          className={`${getCountClassName(playerCount.max + 1 + waitListIndex, playerCount)}${errorPlayerIds?.has(id) ? " error" : ""}`}
          key={id}
        >
          {name}
        </li>
      ))}
    </ul>
  );
};
