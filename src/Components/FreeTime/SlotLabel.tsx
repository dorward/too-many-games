import { slotData } from "../../util/slotData";

export const SlotLabel = ({ slotId }: { slotId: string }) => {
  const { dayOfWeek, time } = slotData(slotId);
  return (
    <>
      {dayOfWeek} <br /> {time}
    </>
  );
};
