import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { autoSolve } from "../../scheduler/autoSolve";
import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import type { AppData, Attendee, ContextValue, Event } from "../../types";
import { mergeUploadedData } from "../../data/mergeUploadedData";

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
  onLoad: (data: AppData) => void;
  onSave: () => void;
  onSchedule: () => Promise<boolean>;
  onClearSchedule: () => void;
  onParticipantFilterChange: React.ChangeEventHandler<HTMLSelectElement>;
  participantFilter: string;
  participantOptions: Attendee[];
}

const autoSchedule = async (
  { data, setData }: ContextValue,
  setCountdown: Dispatch<SetStateAction<number | null>>,
): Promise<boolean> => {
  if (!data) {
    return false;
  }

  try {
    const events = await autoSolve(data, { setCountdown });
    const hasChanges = events.some(
      (event, index) =>
        event.location !== data.events[index]?.location ||
        event.startSlot !== data.events[index]?.startSlot,
    );
    if (hasChanges) {
      setData({ ...data, events });
    }
    return hasChanges;
  } finally {
    setCountdown(null);
  }
};

const clearSchedule = ({ data, setData }: ContextValue) => {
  if (!data) {
    return;
  }

  setData({
    ...data,
    events: data.events.map(clearEventSchedule),
  });
};

const scheduleData = (
  context: ContextValue,
  setCountdown: Dispatch<SetStateAction<number | null>>,
): Promise<boolean> => {
  if (!context.data) {
    alert("Missing event information. Cannot schedule");
    return Promise.resolve(false);
  }

  return autoSchedule(context, setCountdown);
};

export const useUploadData = (): UseUploadReturn => {
  const context = useTooManyGamesData();
  const [countdown, setCountdown] = useState<null | number>(null);
  const [participantFilter, setParticipantFilter] = useState("");

  const participantOptions = useMemo(
    () => (context.data?.attendees ?? []).toSorted((a, b) => a.name.localeCompare(b.name)),
    [context.data?.attendees],
  );

  const onSave = () => {
    downloadFile(context.data);
  };

  const onParticipantFilterChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    setParticipantFilter(event.currentTarget.value);
  };

  return {
    countdown,
    onClearSchedule: () => {
      clearSchedule(context);
    },
    onLoad: (uploadedData) => {
      const nextData =
        context.data === null ? uploadedData : mergeUploadedData(context.data, uploadedData);
      context.setData(nextData);
      setParticipantFilter("");
    },
    onParticipantFilterChange,
    onSave,
    onSchedule: () => scheduleData(context, setCountdown),
    participantFilter,
    participantOptions,
  };
};
