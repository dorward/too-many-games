import { useCallback } from "react";
import { Modal } from "../../../EventGrid/Modal";
import { ScheduleDialogActions } from "./ScheduleDialogActions";
import { ScheduleDialogMessage } from "./ScheduleDialogMessage";
import type { ScheduleDialogProps, ScheduleDialogState } from "./scheduleDialogTypes";

const dialogTitles: Record<ScheduleDialogState, string> = {
  "all-scheduled": "Schedule complete",
  confirm: "Run auto-scheduler",
  conflicts: "Scheduling conflicts",
  failed: "Scheduling failed",
  "no-changes": "No scheduling changes",
};

export const ScheduleDialog = ({
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
