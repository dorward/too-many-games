import { slotData } from "../../util/slotData";
import type { DayParity } from "./getDayParity";

interface DayOfWeekCellProps {
  day: string;
  dayParity: DayParity;
  rowSpan?: number;
}

export const DayOfWeekCell = ({ day, dayParity, rowSpan }: DayOfWeekCellProps) => {
  const { dayOfWeek } = slotData(day);
  return (
    <td rowSpan={rowSpan} className={`dayOfWeek ${dayParity}`}>
      {dayOfWeek}
    </td>
  );
};
