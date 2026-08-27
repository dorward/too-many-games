import { FaTimes } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";

interface ClearScheduleDialogActionsProps {
  closeDialog: () => void;
}

export const ClearScheduleDialogActions = ({
  closeDialog,
}: ClearScheduleDialogActionsProps) => (
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
