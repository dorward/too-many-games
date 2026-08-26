import { useCallback, useMemo, useState } from "react";
import { FaCalendarCheck, FaTimes } from "react-icons/fa";
import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import { getSchedulingErrors } from "../../scheduler/getSchedulingErrors";
import { Modal } from "../event-grid/Modal";

interface ScheduleControlProps {
  onSchedule: () => Promise<boolean>;
}

type ScheduleDialogState =
  | "all-scheduled"
  | "confirm"
  | "conflicts"
  | "failed"
  | "no-changes";

interface ScheduleDialogProps extends ScheduleControlProps {
  closeDialog: () => void;
  dialogState: ScheduleDialogState;
  isOpen: boolean;
  schedulingError: string | null;
}

const ScheduleDialogActions = ({
  canSchedule,
  closeDialog,
}: {
  canSchedule: boolean;
  closeDialog: () => void;
}) => (
  <div className="modal-actions">
    {canSchedule && (
      <button aria-label="Run auto-scheduler" title="Run auto-scheduler" type="submit">
        <FaCalendarCheck />
      </button>
    )}
    <button
      aria-label="Close"
      className="modal-close-button"
      onClick={closeDialog}
      title="Close"
      type="button"
    >
      <FaTimes />
    </button>
  </div>
);

const dialogTitles: Record<ScheduleDialogState, string> = {
  "all-scheduled": "Schedule complete",
  confirm: "Run auto-scheduler",
  conflicts: "Scheduling conflicts",
  failed: "Scheduling failed",
  "no-changes": "No scheduling changes",
};

const ScheduleDialogMessage = ({
  dialogState,
  schedulingError,
}: Pick<ScheduleDialogProps, "dialogState" | "schedulingError">) => {
  switch (dialogState) {
    case "conflicts":
      return (
        <p className="modal-error" role="alert">
          The existing schedule contains conflicts. Manually fix them or clear the schedule before
          automatically scheduling the events.
        </p>
      );
    case "all-scheduled":
      return <p role="status">All events are already scheduled.</p>;
    case "failed":
      return (
        <p className="modal-error" role="alert">
          {schedulingError ?? "An unknown auto-scheduler error occurred."}
        </p>
      );
    case "no-changes":
      return (
        <p role="status">
          No scheduling changes were made. The remaining unscheduled events cannot be scheduled
          without conflicts.
        </p>
      );
    case "confirm":
      return <p>Run the auto-scheduler?</p>;
  }
  return null;
};

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

const ScheduleDialog = ({
  closeDialog,
  dialogState,
  isOpen,
  onSchedule,
  schedulingError,
}: ScheduleDialogProps) => {
  const confirmSchedule = useCallback<React.SubmitEventHandler<HTMLFormElement>>(
    (submitEvent) => {
      submitEvent.preventDefault();
      if (dialogState !== "confirm") {
        return;
      }
      closeDialog();
      void onSchedule();
    },
    [closeDialog, dialogState, onSchedule],
  );

  return (
    <Modal isOpen={isOpen} onClose={closeDialog} title={dialogTitles[dialogState]}>
      <form onSubmit={confirmSchedule}>
        <ScheduleDialogMessage dialogState={dialogState} schedulingError={schedulingError} />
        <ScheduleDialogActions
          canSchedule={dialogState === "confirm"}
          closeDialog={closeDialog}
        />
      </form>
    </Modal>
  );
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
