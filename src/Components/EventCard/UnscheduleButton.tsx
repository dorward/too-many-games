import { useCallback } from "react";
import { FaCalendarTimes } from "react-icons/fa";
import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import type { Event } from "../../types";

interface UnscheduleButtonProps {
  event: Event;
}

export const UnscheduleButton = ({ event }: UnscheduleButtonProps) => {
  const { updateEvent } = useTooManyGamesData();
  const unschedule = useCallback(() => {
    updateEvent(event.id, { location: undefined, startSlot: undefined });
  }, [event.id, updateEvent]);

  if (event.location === undefined && event.startSlot === undefined) {
    return null;
  }

  const label = `Unschedule ${event.name}`;
  return (
    <button aria-label={label} onClick={unschedule} title={label} type="button">
      <FaCalendarTimes />
    </button>
  );
};
