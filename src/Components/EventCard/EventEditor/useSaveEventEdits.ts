import { useCallback } from "react";
import { useTooManyGamesData } from "../../../context/useTooManyGamesData";
import type { Event } from "../../../types";

export const useSaveEventEdits = (
  event: Event,
  location: Event["location"],
  players: Event["players"],
  startSlot: Event["startSlot"],
  closeEditor: () => void,
) => {
  const { updateEvent } = useTooManyGamesData();
  return useCallback<React.SubmitEventHandler<HTMLFormElement>>(
    (submitEvent) => {
      submitEvent.preventDefault();
      updateEvent(event.id, {
        location,
        players,
        startSlot,
        waitList: event.waitList.filter((attendeeId) => !players.includes(attendeeId)),
      });
      closeEditor();
    },
    [closeEditor, event.id, event.waitList, location, players, startSlot, updateEvent],
  );
};
