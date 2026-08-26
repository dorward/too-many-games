import type { AppData, Assignment, Event } from "../types";
import { applyAssignmentsToEvents } from "./applyAssignmentsToEvents";
import AutoSolveWorker from "./autoSolve.worker?worker";
import type { Complete, WorkerMessage } from "./worker.types";
import { getSchedulingErrors } from "./getSchedulingErrors";

interface Options {
  timeLimitMs?: number;
  setCountdown?: (ms: number) => void;
}

const isAssignment = (data: unknown): data is Assignment =>
  data !== null &&
  typeof data === "object" &&
  "location" in data &&
  typeof data.location === "string" &&
  "startSlot" in data &&
  typeof data.startSlot === "string";

const isMessage = (data: unknown): data is WorkerMessage => {
  if (data === null || typeof data !== "object") {
    return false;
  }
  if (!("type" in data)) {
    return false;
  }
  if (data.type === "started") {
    return "timeLimit" in data && typeof data.timeLimit === "number";
  }
  if (data.type !== "complete") {
    return false;
  }
  return (
    "bestAssignments" in data &&
    data.bestAssignments !== null &&
    typeof data.bestAssignments === "object" &&
    !Array.isArray(data.bestAssignments) &&
    Object.values(data.bestAssignments).every(isAssignment) &&
    "bestCount" in data &&
    typeof data.bestCount === "number"
  );
};

const getError = (error: unknown) =>
  error instanceof Error ? error : new Error("Unknown auto-scheduler error");

const applyWorkerResult = (data: AppData, message: Complete) => {
  const bestAssignments = new Map<string, Assignment>(Object.entries(message.bestAssignments));
  const events = applyAssignmentsToEvents(data.events, bestAssignments);
  if (getSchedulingErrors(events).size > 0) {
    throw new Error("Autoscheduler produced a schedule with conflicts");
  }
  return events;
};

export const autoSolve = (data: AppData, options: Options = {}): Promise<Event[]> =>
  new Promise((resolve, reject) => {
    const worker = new AutoSolveWorker();
    const rejectWorker = (error: unknown) => {
      worker.terminate();
      reject(getError(error));
    };

    worker.onmessage = (event) => {
      try {
        if (!isMessage(event.data)) {
          rejectWorker(new Error("Worker message does not match expected type"));
          return;
        }
        const message = event.data;

        if (message.type === "started") {
          options.setCountdown?.(message.timeLimit);
        }

        if (message.type === "complete") {
          worker.terminate();
          resolve(applyWorkerResult(data, message));
        }
      } catch (error: unknown) {
        rejectWorker(error);
      }
    };

    worker.onmessageerror = () => {
      rejectWorker(new Error("Worker message deserialization error"));
    };

    worker.onerror = (errorEvent) => {
      rejectWorker(new Error(errorEvent.message));
    };

    try {
      worker.postMessage({
        data,
        timeLimitMs: options.timeLimitMs,
      });
    } catch (error: unknown) {
      rejectWorker(error);
    }
  });
