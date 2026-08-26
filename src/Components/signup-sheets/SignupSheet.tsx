import type { Event } from "../../types";
import { describeSchedule } from "../../scheduler/describeSchedule";
import { Location } from "../location/Location";
import { PlayerList } from "../player-list/PlayerList";

interface SignupSheetProps {
  event: Event;
}

const getNoteParagraphs = (notes: string) => {
  const occurrences = new Map<string, number>();
  return notes
    .split(/(?:\r?\n)+/u)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((text) => {
      const occurrence = (occurrences.get(text) ?? 0) + 1;
      occurrences.set(text, occurrence);
      return { key: `${text}-${occurrence}`, text };
    });
};

interface PlayerCountProps {
  playerCount: Event["playerCount"];
}

const PlayerCount = ({ playerCount }: PlayerCountProps) => (
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

export const SignupSheet = ({ event }: SignupSheetProps) => {
  const noteParagraphs = getNoteParagraphs(event.notes);

  return (
    <section className="signup-sheet">
      <header>
        <h2>{event.name}</h2>
        <div className="signup-sheet-details">
          <div className="scheduledTime">{describeSchedule(event)}</div>
          <Location event={event} />
          <PlayerCount playerCount={event.playerCount} />
        </div>
      </header>
      <div className="signup-sheet-body">
        {noteParagraphs.length > 0 && (
          <div className="signup-sheet-notes">
            {noteParagraphs.map(({ key, text }) => (
              <p key={key}>{text}</p>
            ))}
          </div>
        )}
        <PlayerList
          additionalWaitListSlots={2}
          facilitatorId={event.facilitator}
          playerCount={event.playerCount}
          playerIds={event.players}
          vertical
          waitListIds={event.waitList}
        />
      </div>
    </section>
  );
};
