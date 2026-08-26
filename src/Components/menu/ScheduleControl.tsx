import { useCallback, useMemo, useState } from "react";
import { FaCalendarCheck, FaTimes } from "react-icons/fa";
import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import { getSchedulingErrors } from "../../scheduler/getSchedulingErrors";
import { Modal } from "../event-grid/Modal";

interface ScheduleControlProps {
  onSchedule: () => Promise<boolean>;
}

type ScheduleDialogState = "all-scheduled" | "confirm" | "conflicts" | "no-changes";

interface ScheduleDialogProps extends ScheduleControlProps {
  closeDialog: () => void;
  dialogState: ScheduleDialogState;
  isOpen: boolean;
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
  "no-changes": "No scheduling changes",
};

const ScheduleDialogMessage = ({ dialogState }: { dialogState: ScheduleDialogState }) => {
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
): ScheduleDialogState => {
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
        <ScheduleDialogMessage dialogState={dialogState} />
        <ScheduleDialogActions
          canSchedule={dialogState === "confirm"}
          closeDialog={closeDialog}
        />
      </form>
    </Modal>
  );
};

export const ScheduleControl = ({ onSchedule }: ScheduleControlProps) => {
  const { data } = useTooManyGamesData();
  const [isOpen, setIsOpen] = useState(false);
  const [noChanges, setNoChanges] = useState(false);
  const allEventsScheduled = useMemo(
    () => data !== null && data.events.every(({ startSlot }) => startSlot !== undefined),
    [data],
  );
  const hasConflicts = useMemo(
    () => data !== null && getSchedulingErrors(data.events).size > 0,
    [data],
  );
  const dialogState = getDialogState(allEventsScheduled, hasConflicts, noChanges);
  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);
  const openDialog = useCallback(() => {
    setNoChanges(false);
    setIsOpen(true);
  }, []);
  const runScheduler = useCallback(async () => {
    const hasChanges = await onSchedule();
    if (!hasChanges) {
      setNoChanges(true);
      setIsOpen(true);
    }
    return hasChanges;
  }, [onSchedule]);

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
      />
    </>
  );
};
