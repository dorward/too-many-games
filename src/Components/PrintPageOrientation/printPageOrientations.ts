import type { View } from "../../types";

export type PrintOrientation = "landscape" | "portrait";

export const printPageOrientations: Record<View, PrintOrientation> = {
  attendees: "portrait",
  "event-grid": "landscape",
  "event-list": "landscape",
  "free-time": "landscape",
  "room-map": "portrait",
  schedules: "landscape",
  "signup-sheets": "portrait",
};
