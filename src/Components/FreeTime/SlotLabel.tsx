import { slotData } from "../../util/slotData";

const slotLabels: Record<string, string> = {
  "1": "10am",
  "2": "2pm",
  "3": "6pm",
};

interface SlotLabelProps {
  slotId: string;
}

export const SlotLabel = ({ slotId }: SlotLabelProps) =>
  slotLabels[slotData(slotId).slotNumberStr] ?? "";
