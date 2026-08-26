import type { ScheduleDialogProps } from "./scheduleDialogTypes";

type ScheduleDialogMessageProps = Pick<
  ScheduleDialogProps,
  "dialogState" | "schedulingError"
>;

export const ScheduleDialogMessage = ({
  dialogState,
  schedulingError,
}: ScheduleDialogMessageProps) => {
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
