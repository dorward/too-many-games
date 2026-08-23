import type { Assignment } from "../types";

export interface Started {
  timeLimit: number;
  type: "started";
}
export interface Complete {
  bestAssignments: Record<string, Assignment>;
  bestCount: number;
  type: "complete";
}
export type WorkerMessage = Started | Complete;
