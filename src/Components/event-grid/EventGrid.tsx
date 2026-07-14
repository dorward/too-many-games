import { useMemo, type ReactNode } from "react";
import type { Game } from "../../types";
import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import { DayOfWeekCell } from "../DayOfWeekCell";

type EventProps = {
  event: Game;
  list?: boolean;
};

const Event = ({ event, list }: EventProps) => {
  if (list) {
    return <div style={{ outline: "solid orange 1px" }}>{event.name}</div>;
  }
  return (
    <td colSpan={event.length}>
      <div style={{ outline: "solid orange 1px" }}>{event.name}</div>
    </td>
  );
};

const sortableSlotId = (s: string) => parseInt(s.replaceAll("-", ""));

export const EventGrid = () => {
  const { data } = useTooManyGamesData();

  if (!data) {
    throw new Error("missing data");
  }

  const { events } = data;

  const { maxGamesInASlotToday, gamesBySlot, unscheduled } = useMemo(() => {
    const gamesBySlotMap = new Map<string, Game[]>();
    const unscheduled: Game[] = [];
    events.forEach((event) => {
      const { startSlot, length } = event;
      if (!startSlot) {
        unscheduled.push(event);
        return;
      }
      const [year, month, dayOfMonth, slotNumber] = startSlot.split("-");
      const slotNo = parseInt(slotNumber);
      for (let i = 0; i < length; i++) {
        const id = `${year}-${month}-${dayOfMonth}-${slotNo + i}`;
        if (gamesBySlotMap.has(id)) {
          gamesBySlotMap.get(id)?.push(event);
        } else {
          gamesBySlotMap.set(id, [event]);
        }
      }
    });

    const maxGamesInASlotTodayMap = new Map<string, number>();
    Array.from(gamesBySlotMap.entries()).forEach(([slotId, events]) => {
      const [year, month, dayOfMonth] = slotId.split("-");
      const date = `${year}-${month}-${dayOfMonth}`;
      const previous = maxGamesInASlotTodayMap.get(date) || 0;
      if (events.length > previous) {
        maxGamesInASlotTodayMap.set(date, events.length);
      }
    });
    const maxGamesInASlotToday = [...maxGamesInASlotTodayMap.entries()].toSorted(
      ([a], [b]) => sortableSlotId(b) - sortableSlotId(a),
    );
    return { maxGamesInASlotToday, gamesBySlot: gamesBySlotMap, unscheduled };
  }, [events]);

  return (
    <>
      <table>
        <thead>
          <th>Day</th>
          <th>Morning</th>
          <th>Afternoon</th>
          <th>Evening</th>
        </thead>
        <tbody>
          {maxGamesInASlotToday.map(([date, rowSpan]) =>
            Array(rowSpan)
              .fill(date)
              .map((value, index) => {
                const rowContents: ReactNode[] = [];
                if (index === 0) {
                  rowContents.push(<DayOfWeekCell day={value} rowSpan={rowSpan} />);
                  for (let slot = 1; slot <= 3; slot++) {
                    const slotId = `${value}-${slot}`;
                    const game = gamesBySlot.get(slotId)?.[index];
                    // Don't put it on the grid if it doesn't exist or if it is a colspan one from earlier today
                    if (game && game.startSlot === slotId) {
                      rowContents.push(<Event event={game} />);
                    }
                  }
                }
                return <tr key={`${date}r${index}`}>{rowContents}</tr>;
              }),
          )}
        </tbody>
      </table>
      {unscheduled.length > 0 && (
        <>
          <h2>Unscheduled</h2>
          <ul>
            {unscheduled.map((event) => (
              <li key={event.id}>
                <Event event={event} list />
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};
