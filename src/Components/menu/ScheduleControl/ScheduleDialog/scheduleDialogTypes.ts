export type ScheduleDialogState =
  | "all-scheduled"
  | "confirm"
  | "conflicts"
  | "failed"
  | "no-changes";

export interface ScheduleDialogProps {
  closeDialog: () => void;
  dialogState: ScheduleDialogState;
  isOpen: boolean;
  onSchedule: () => Promise<boolean>;
  schedulingError: string | null;
}
