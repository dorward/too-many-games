import { slotData } from "../../util/slotData";

const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_MINUTE = 60;
const MS_PER_SECOND = 1000;
const MS_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MS_PER_SECOND;

interface DayOfWeekCellProps {
  day: string;
  rowSpan?: number;
}

export const DayOfWeekCell = ({ day, rowSpan }: DayOfWeekCellProps) => {
  const { dayOfWeek } = slotData(day);
  const dayIndex = Math.floor(new Date(`${day}T00:00:00`).getTime() / MS_PER_DAY);
  const dayParity = dayIndex % 2 === 0 ? "even" : "odd";
  return (
    <td rowSpan={rowSpan} className={`dayOfWeek ${dayParity}`}>
      {dayOfWeek}
    </td>
  );
};
