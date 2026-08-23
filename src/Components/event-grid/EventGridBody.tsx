import type { OrganisedScheduleDays } from "../../types";
import type { SchedulingErrors } from "../../scheduler/getSchedulingErrors";
import { DayOfWeekCell } from "./DayOfWeekCell";
import { EventCell } from "../Event/Event";

interface EventGridBodyProps {
  schedule: OrganisedScheduleDays;
  maxEventsPerDay: Record<string, number>;
  schedulingErrors: SchedulingErrors;
}

export const EventGridBody = ({ schedule, maxEventsPerDay, schedulingErrors }: EventGridBodyProps) =>
  Object.entries(schedule)
    .map(([date, slots]) => {
      const max = maxEventsPerDay[date];
      const ourSlots = [
        slots[`${date}-1`] ?? [],
        slots[`${date}-2`] ?? [],
        slots[`${date}-3`] ?? [],
      ];
      const rows: React.ReactNode[] = [];
      for (let row = 0; row < max; row++) {
        const rowData: React.ReactNode[] = [];
        if (row === 0) {
          rowData.push(<DayOfWeekCell key="day" rowSpan={max} day={date} />);
        }

        for (let col = 0; col < 3; col++) {
          const event = ourSlots[col][row];
          if (event === undefined) {
            rowData.push(<td key={col} />);
          }
          if (event) {
            rowData.push(
              <EventCell
                key={col}
                event={event}
                schedulingError={schedulingErrors.get(event.id)}
              />,
            );
          }
        }

        rows.push(<tr key={`${date}-${row}`}>{rowData}</tr>);
      }
      return rows;
    })
    .flat();
