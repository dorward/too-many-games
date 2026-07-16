import { slotData } from "../../util/slotData";

interface DayOfWeekCellProps {
  day: string;
  rowSpan?: number;
}

export const DayOfWeekCell = ({ day, rowSpan }: DayOfWeekCellProps) => {
  const { dayOfWeek } = slotData(day);
  return (
    <td rowSpan={rowSpan} className="dayOfWeek">
      {dayOfWeek}
    </td>
  );
};
