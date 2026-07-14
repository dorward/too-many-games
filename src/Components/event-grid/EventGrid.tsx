import type { Game } from "../../types";
import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import { DayOfWeekCell } from "../DayOfWeekCell";

type OrganisedScheduleSlots = Record<string, (Game | null | undefined)[]>;
type OrganisedScheduleDays = Record<string, OrganisedScheduleSlots>;

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

export const EventGrid = () => {
  const { data } = useTooManyGamesData();

  if (!data) {
    throw new Error("missing data");
  }

  const { events } = data;

  const schedule: OrganisedScheduleDays = {};
  const unscheduled: Game[] = [];

  events
    .toSorted((a, b) => (a.startSlot ?? "").localeCompare(b.startSlot ?? ""))
    .forEach((event) => {
      const { startSlot, length } = event;
      if (!startSlot) {
        unscheduled.push(event);
        return;
      }
      const [year, month, dayOfMonth, slotNumberStr] = startSlot.split("-");
      const day = `${year}-${month}-${dayOfMonth}`;
      const slotsToday = (schedule[day] ??= {});
      const startSlotEvents = (slotsToday[startSlot] ??= []);
      const undefinedIndex = startSlotEvents.findIndex((v) => v === undefined);
      const targetIndex = undefinedIndex === -1 ? startSlotEvents.length : undefinedIndex;
      startSlotEvents[targetIndex] = event;

      const slotNo = parseInt(slotNumberStr);
      if (length > 1) {
        const secondSlot = `${day}-${slotNo + 1}`;
        const secondSlotEvents = (slotsToday[secondSlot] ??= []);
        secondSlotEvents[targetIndex] = null;
      }
      if (length > 2) {
        const thirdSlot = `${day}-${slotNo + 2}`;
        const thirdSlotEvents = (slotsToday[thirdSlot] ??= []);
        thirdSlotEvents[targetIndex] = null;
      }
    });

  const maxGamesPerDay: Record<string, number> = {};
  Object.entries(schedule).forEach(([date, slots]) => {
    const max = Object.values(slots).reduce((max, current) => Math.max(max, current.length), 0);
    maxGamesPerDay[date] = max;
  });

  const tbody = Object.entries(schedule)
    .map(([date, slots]) => {
      const max = maxGamesPerDay[date];
      const ourSlots = [slots[`${date}-1`], slots[`${date}-2`], slots[`${date}-3`]];
      const rows: React.ReactNode[] = [];
      for (let row = 0; row < max; row++) {
        const rowData: React.ReactNode[] = [];
        if (row === 0) {
          rowData.push(<DayOfWeekCell rowSpan={max} day={date} />);
        }

        for (let col = 0; col < 3; col++) {
          const game = ourSlots[col][row];
          if (game === undefined) {
            rowData.push(<td />);
          }
          if (game) {
            rowData.push(<Event event={game} />);
          }
        }

        rows.push(<tr>{rowData}</tr>);
      }
      return rows;
    })
    .flat();

  return (
    <>
      <table>
        <thead>
          <th>Day</th>
          <th>Morning</th>
          <th>Afternoon</th>
          <th>Evening</th>
        </thead>
        <tbody>{tbody}</tbody>
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
