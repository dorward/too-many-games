import { useCallback, useState } from "react";
import { MdAutoDelete } from "react-icons/md";
import { ClearScheduleDialog } from "./ClearScheduleDialog/ClearScheduleDialog";

interface ClearScheduleControlProps {
  onClearSchedule: () => void;
}

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
