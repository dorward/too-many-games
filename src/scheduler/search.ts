import { place } from "./place";
import { unplace } from "./unplace";
import { forEachValidPlacement } from "./getValidPlacements";
import type { Limits, EventWithScheduleHelpers, Store } from "../types";

interface SearchProps {
  best: {
    bestCount: number;
  };
  index: number;
  eventsWithScheduleHelpers: EventWithScheduleHelpers[];
  limits: Limits;
  scheduledCount: number;
  slots: string[];
  store: Store;
  recordBest: (scheduledCount: number) => void;
}

const TIME_CHECK_INTERVAL = 256;

export const search = ({
  index: initialIndex,
  scheduledCount: initialScheduledCount,
  eventsWithScheduleHelpers,
  limits,
  best,
  store,
  slots,
  recordBest,
}: SearchProps) => {
  let nodes = 0;
  let timedOut = false;

  const dfs = (index: number, scheduledCount: number): void => {
    if ((nodes++ & (TIME_CHECK_INTERVAL - 1)) === 0) {
      if (Date.now() - limits.startTime > limits.timeLimit) {
        timedOut = true;
        return;
      }
    }

    recordBest(scheduledCount);

    const remaining = eventsWithScheduleHelpers.length - index;
    if (scheduledCount + remaining <= best.bestCount) {
      return;
    }

    if (index === eventsWithScheduleHelpers.length) {
      return;
    }

    const item = eventsWithScheduleHelpers[index];
    forEachValidPlacement(store, item, (startIdx, location) => {
      place(store, slots, item, startIdx, location);
      dfs(index + 1, scheduledCount + 1);
      unplace(store, item, startIdx, location);
      if (timedOut) {
        return false;
      }
      return true;
    });

    dfs(index + 1, scheduledCount); // Also try leaving this event unscheduled.
  };

  dfs(initialIndex, initialScheduledCount);
};
