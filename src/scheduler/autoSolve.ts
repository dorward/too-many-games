import type { AppData, Assignment, Event } from "../types";
import { applyAssignmentsToEvents } from "./applyAssignmentsToEvents";
import AutoSolveWorker from "./autoSolve.worker?worker";
import type { WorkerMessage } from "./worker.types";

interface Options {
  timeLimitMs?: number;
  setCountdown?: (ms: number) => void;
}

const isMessage = (data: unknown): data is WorkerMessage => {
  if (data === null || typeof data !== "object") {
    return false;
  }
  if (!("type" in data) || typeof data.type !== "string") {
    return false;
  }
  return data.type === "complete" || data.type === "started";
};

export const autoSolve = (data: AppData, options: Options = {}): Promise<Event[]> =>
  new Promise((resolve, reject) => {
    const worker = new AutoSolveWorker();

    worker.onmessage = (event) => {
      if (!isMessage(event.data)) {
        throw new Error("Worker message does not match expected type");
      }
      const message = event.data;

      if (message.type === "started") {
        options.setCountdown?.(message.timeLimit);
      }

      if (message.type === "complete") {
        const bestAssignments = new Map<string, Assignment>(
          Object.entries(message.bestAssignments),
        );

        worker.terminate();

        resolve(applyAssignmentsToEvents(data.events, bestAssignments));
      }
    };

    worker.onmessageerror = () => {
      worker.terminate();
      reject(new Error("Worker message deserialization error"));
    };

    worker.onerror = (errorEvent) => {
      worker.terminate();
      const error = new Error(errorEvent.message);
      reject(error);
    };

    worker.postMessage({
      data,
      timeLimitMs: options.timeLimitMs,
    });
  });
