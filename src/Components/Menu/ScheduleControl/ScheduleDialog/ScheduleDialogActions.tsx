import { FaCalendarCheck, FaTimes } from "react-icons/fa";

interface ScheduleDialogActionsProps {
  canSchedule: boolean;
  closeDialog: () => void;
}

export const ScheduleDialogActions = ({
  canSchedule,
  closeDialog,
}: ScheduleDialogActionsProps) => (
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
