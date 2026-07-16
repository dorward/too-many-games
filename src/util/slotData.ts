const slotToTime = [null, "Morning", "Afternoon", "Evening"];

export const slotData = (slotId: string) => {
  const [year, month, dayOfMonth, slotNumberStr] = slotId.split("-");
  const date = new Date(`${year}-${month}-${dayOfMonth}T00:00:00`);
  const dayOfWeek = date.toLocaleDateString("en-GB", { weekday: "short" });
  const time = slotToTime[parseInt(slotNumberStr, 10)];
  return { dayOfMonth, dayOfWeek, month, slotNumberStr, time, year };
};
