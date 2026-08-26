import type { Event } from "../../../types";

interface PlayerCountProps {
  playerCount: Event["playerCount"];
}

export const PlayerCount = ({ playerCount }: PlayerCountProps) => (
  <dl className="signup-sheet-player-count">
    <div>
      <dt>Min</dt>
      <dd>{playerCount.min}</dd>
    </div>
    <div>
      <dt>Desirable</dt>
      <dd>{playerCount.desirable}</dd>
    </div>
    <div>
      <dt>Max</dt>
      <dd>{playerCount.max}</dd>
    </div>
  </dl>
);
