import { useCallback } from "react";
import { Modal } from "../../../EventGrid/Modal";
import { ClearScheduleDialogActions } from "./ClearScheduleDialogActions";

interface ClearScheduleDialogProps {
  closeDialog: () => void;
  isOpen: boolean;
  onClearSchedule: () => void;
}

export const ClearScheduleDialog = ({
  closeDialog,
  isOpen,
  onClearSchedule,
}: ClearScheduleDialogProps) => {
  const confirmClear = useCallback<React.SubmitEventHandler<HTMLFormElement>>(
    (submitEvent) => {
      submitEvent.preventDefault();
      closeDialog();
      onClearSchedule();
    },
    [closeDialog, onClearSchedule],
  );

  return (
    <Modal isOpen={isOpen} onClose={closeDialog} title="Clear schedule">
      <form onSubmit={confirmClear}>
        <p>Delete all scheduling data?</p>
        <ClearScheduleDialogActions closeDialog={closeDialog} />
      </form>
    </Modal>
  );
};
