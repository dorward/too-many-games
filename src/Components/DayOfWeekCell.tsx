type DayOfWeekCellProps = {
  day: string;
  rowSpan?: number;
};

export const DayOfWeekCell = ({ day, rowSpan }: DayOfWeekCellProps) => {
  const date = new Date(`${day}T00:00:00`);
  const dayOfWeek = date.toLocaleDateString("en-GB", { weekday: "short" });

  return <td rowSpan={rowSpan}>{dayOfWeek}</td>;
};
