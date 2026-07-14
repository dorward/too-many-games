import type { Game } from "../types";

export const describeSchedule = (event: Game): string => {
  if (!event.startSlot) return "Unscheduled";
  const [year, month, dayOfMonth, slotNumber] = event.startSlot.split("-");

  const date = new Date(`${year}-${month}-${dayOfMonth}T00:00:00`);
  const day = date.toLocaleDateString("en-GB", { weekday: "short" });

  const period = (() => {
    if (event.length === 3) {
      return "All Day";
    }
    if (event.length === 2) {
      if (slotNumber === "1") return "Morning & Afternoon";
      return "Afternoon & Evening";
    }
    switch (slotNumber) {
      case "1":
        return "Morning";
      case "2":
        return "Afternoon";
      default:
        return "Evening";
    }
  })();

  return `${day} ${period}`;
};
