import type { Event } from "../../../types";
import { getCountClassName } from "../getCountClassName";

interface EmptyPlayerSlotsProps {
  count: number;
  playerCount: Event["playerCount"];
  startIndex: number;
}

export const EmptyPlayerSlots = ({ count, playerCount, startIndex }: EmptyPlayerSlotsProps) =>
  Array.from({ length: count }, (_, offset) => {
    const index = startIndex + offset;
    return (
      <li
        aria-hidden="true"
        className={getCountClassName(index, playerCount)}
        key={`empty-player-${index}`}
      />
    );
  });
