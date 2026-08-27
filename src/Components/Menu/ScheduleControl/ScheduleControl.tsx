import { useCallback, useMemo, useState } from "react";
import { FaCalendarCheck } from "react-icons/fa";
import { useTooManyGamesData } from "../../../context/useTooManyGamesData";
import { getSchedulingErrors } from "../../../scheduler/getSchedulingErrors";
import { ScheduleDialog } from "./ScheduleDialog/ScheduleDialog";
import type { ScheduleDialogState } from "./ScheduleDialog/scheduleDialogTypes";

interface ScheduleControlProps {
  onSchedule: () => Promise<boolean>;
}

const getDialogState = (
  allEventsScheduled: boolean,
  hasConflicts: boolean,
  noChanges: boolean,
  schedulingError: string | null,
): ScheduleDialogState => {
  if (schedulingError !== null) {
    return "failed";
  }
  if (hasConflicts) {
    return "conflicts";
  }
  if (allEventsScheduled) {
    return "all-scheduled";
  }
  if (noChanges) {
    return "no-changes";
  }
  return "confirm";
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error && error.message.length > 0
    ? error.message
    : "An unknown auto-scheduler error occurred.";

const useSchedulerResult = (
  onSchedule: ScheduleControlProps["onSchedule"],
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const [noChanges, setNoChanges] = useState(false);
  const [schedulingError, setSchedulingError] = useState<string | null>(null);
  const resetResult = useCallback(() => {
    setNoChanges(false);
    setSchedulingError(null);
  }, []);
  const runScheduler = useCallback(async () => {
    try {
      const hasChanges = await onSchedule();
      if (!hasChanges) {
        setNoChanges(true);
        setIsOpen(true);
      }
      return hasChanges;
    } catch (error: unknown) {
      setSchedulingError(getErrorMessage(error));
      setIsOpen(true);
      return false;
    }
  }, [onSchedule, setIsOpen]);
  return { noChanges, resetResult, runScheduler, schedulingError };
};

export const ScheduleControl = ({ onSchedule }: ScheduleControlProps) => {
  const { data } = useTooManyGamesData();
  const [isOpen, setIsOpen] = useState(false);
  const { noChanges, resetResult, runScheduler, schedulingError } = useSchedulerResult(
    onSchedule,
    setIsOpen,
  );
  const allEventsScheduled = useMemo(
    () => data !== null && data.events.every(({ startSlot }) => startSlot !== undefined),
    [data],
  );
  const hasConflicts = useMemo(
    () => data !== null && getSchedulingErrors(data.events).size > 0,
    [data],
  );
  const dialogState = getDialogState(
    allEventsScheduled,
    hasConflicts,
    noChanges,
    schedulingError,
  );
  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);
  const openDialog = useCallback(() => {
    resetResult();
    setIsOpen(true);
  }, [resetResult]);

  return (
    <>
      <button aria-label="Run auto-scheduler" title="Run auto-scheduler" onClick={openDialog}>
        <FaCalendarCheck />
      </button>
      <ScheduleDialog
        closeDialog={closeDialog}
        dialogState={dialogState}
        isOpen={isOpen}
        onSchedule={runScheduler}
        schedulingError={schedulingError}
      />
    </>
  );
};
