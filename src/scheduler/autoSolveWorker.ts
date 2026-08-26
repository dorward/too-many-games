import type { AppData, Assignment } from "../types";
import { categoriseLocations } from "./categoriseLocations";
import { generateSlotIds } from "./generateSlotIds";
import { prepEvents } from "./prepEvents";
import { createStore } from "./createStore";
import { search } from "./search";
import type { Complete, Started } from "./workerTypes";

const DEFAULT_TIME_LIMIT = 300_000;

const trackBest = (assignments?: Map<string, Assignment>, bestCount = 0) => ({
  bestAssignments: new Map<string, Assignment>(assignments),
  bestCount,
});

interface WorkerInput {
  data: AppData;
  timeLimitMs?: number;
}

self.onmessage = (event: MessageEvent<WorkerInput>) => {
  const { data, timeLimitMs } = event.data;

  const { slots } = generateSlotIds(data.dates);
  const { locations, events } = data;

  const { allLocationIds, autoLocationIds } = categoriseLocations(locations);
  const items = prepEvents(events, allLocationIds, autoLocationIds, slots);

  const store = createStore(slots.length);
  const { assignments } = store;

  const best = trackBest();

  const recordBest = (scheduledCount: number) => {
    if (scheduledCount > best.bestCount) {
      Object.assign(best, trackBest(assignments, scheduledCount));
    }
  };

  const limits = {
    startTime: Date.now(),
    timeLimit: timeLimitMs ?? DEFAULT_TIME_LIMIT,
  };

  const started: Started = { timeLimit: limits.timeLimit, type: "started" };
  self.postMessage(started);

  search({
    best,
    eventsWithScheduleHelpers: items,
    index: 0,
    limits,
    recordBest,
    scheduledCount: 0,
    slots,
    store,
  });

  // Maps cannot be structured-cloned directly, so convert to a plain object
  const bestAssignmentsObject = Object.fromEntries(best.bestAssignments);

  const complete: Complete = {
    bestAssignments: bestAssignmentsObject,
    bestCount: best.bestCount,
    type: "complete",
  };

  self.postMessage(complete);
};
