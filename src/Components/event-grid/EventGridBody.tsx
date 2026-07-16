import type { OrganisedScheduleDays } from "../../types";
import { DayOfWeekCell } from "./DayOfWeekCell";
import { Event } from "../Event/Event";

interface EventGridBodyProps {
  schedule: OrganisedScheduleDays;
  maxGamesPerDay: Record<string, number>;
}

export const EventGridBody = ({ schedule, maxGamesPerDay }: EventGridBodyProps) =>
  Object.entries(schedule)
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
