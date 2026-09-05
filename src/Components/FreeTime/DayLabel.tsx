import { slotData } from "../../util/slotData";

interface DayLabelProps {
  day: string;
}

export const DayLabel = ({ day }: DayLabelProps) => slotData(day).dayOfWeek;
