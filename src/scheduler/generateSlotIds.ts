import type { Dates, SlotId } from "../types";

const pad = (n: number) => n.toString().padStart(2, "0");

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const generateSlotIds = (dates: Dates) => {
  const slots: SlotId[] = [];
  const start = startOfDay(dates.start);
  const end = startOfDay(dates.end);

  let current = addDays(start, 1);

  while (current < end) {
    const dateStr = formatDate(current);
    for (let slot = 1; slot <= 3; slot++) {
      slots.push(`${dateStr}-${slot}`);
    }
    current = addDays(current, 1);
  }

  const grouped = new Map<string, string[]>();
  for (const slot of slots) {
    const day = slot.slice(0, 10);
    const existing = grouped.get(day);
    if (existing) {
      existing.push(slot);
    } else {
      grouped.set(day, [slot]);
    }
  }

  const days = Array.from(grouped.entries());

  return { slots, days };
};
