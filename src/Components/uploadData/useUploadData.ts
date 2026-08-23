import { useState, type Dispatch, type SetStateAction } from "react";
import { autoSolve } from "../../scheduler/autoSolve";
import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import type { ContextValue, Event } from "../../types";

const downloadFile = (data: any) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "eventData.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const clearEventSchedule = (event: Event): Event => {
  const clearedEvent = { ...event };
  delete clearedEvent.location;
  delete clearedEvent.startSlot;
  return clearedEvent;
};

interface UseUploadReturn {
  countdown: null | number;
  onLoad: () => void;
  onSave: () => void;
  onSchedule: () => void;
  onClearSchedule: () => void;
}

const autoSchedule = async (
  { data, setData }: ContextValue,
  setCountdown: Dispatch<SetStateAction<number | null>>,
) => {
  if (!data) {
    return;
  }

  try {
    const events = await autoSolve(data, { setCountdown });
    setData({ ...data, events });
  } finally {
    setCountdown(null);
  }
};

export const useUploadData = (): UseUploadReturn => {
  const context = useTooManyGamesData();
  const [countdown, setCountdown] = useState<null | number>(null);

  const onSave = () => {
    downloadFile(context.data);
  };

  const onLoad = () => {
    if (confirm("Discard all data and return to the load screen?")) {
      context.setData(null);
    }
  };

  const onSchedule = (): void => {
    const { data } = context;
    if (!data) {
      alert("Missing event information. Cannot schedule");
      return;
    }

    if (confirm("Run auto-scheduler?")) {
      void autoSchedule(context, setCountdown);
    }
  };

  const onClearSchedule = () => {
    const { data } = context;
    if (!data) {
      return;
    }

    if (!confirm("Delete all scheduling data?")) {
      return;
    }

    context.setData({
      ...data,
      events: data.events.map(clearEventSchedule),
    });
  };

  return { countdown, onClearSchedule, onLoad, onSave, onSchedule };
};
