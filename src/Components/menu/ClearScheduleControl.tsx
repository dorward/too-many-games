import { useCallback, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";
import { Modal } from "../event-grid/Modal";

interface ClearScheduleControlProps {
  onClearSchedule: () => void;
}

interface ClearScheduleDialogProps extends ClearScheduleControlProps {
  closeDialog: () => void;
  isOpen: boolean;
}

const ClearScheduleDialogActions = ({ closeDialog }: Pick<ClearScheduleDialogProps, "closeDialog">) => (
  <div className="modal-actions">
    <button aria-label="Clear schedule" title="Clear schedule" type="submit">
      <MdAutoDelete />
    </button>
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

const ClearScheduleDialog = ({
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

export const ClearScheduleControl = ({ onClearSchedule }: ClearScheduleControlProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);
  const openDialog = useCallback(() => {
    setIsOpen(true);
  }, []);

  return (
    <>
      <button aria-label="Clear schedule" title="Clear schedule" onClick={openDialog}>
        <MdAutoDelete />
      </button>
      <ClearScheduleDialog
        closeDialog={closeDialog}
        isOpen={isOpen}
        onClearSchedule={onClearSchedule}
      />
    </>
  );
};
