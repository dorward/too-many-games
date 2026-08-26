import type { Event } from "../../types";
import type { SchedulingError } from "../../scheduler/getSchedulingErrors";
import { useCallback, useState } from "react";
import { Modal } from "../event-grid/Modal";
import { FaRegEdit } from "react-icons/fa";
import { PlayerList } from "../player-list/PlayerList";
import { ScheduledTime } from "../scheduled-time/ScheduledTime";
import { Location } from "../location/Location";
import { EventEditor } from "./EventEditor";
import "./event.css";

interface EventProps {
  event: Event;
  schedulingError?: SchedulingError;
}

export const EventComponent = ({ event, schedulingError }: EventProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);
  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const openMsg = `Open ${event.name}`;

  return (
    <div className={schedulingError?.hasError ? "event error" : "event"}>
      <header>
        <h2>{event.name}</h2>
        <button className="editButton" onClick={openModal} aria-label={openMsg} title={openMsg}>
          <FaRegEdit />
        </button>
      </header>
      <div>
        <div className="row">
          <ScheduledTime event={event} />
          <Location event={event} hasError={schedulingError?.location} />
        </div>
        <PlayerList
          facilitatorId={event.facilitator}
          playerIds={event.players}
          waitListIds={event.waitList}
          playerCount={event.playerCount}
          errorPlayerIds={schedulingError?.participantIds}
        />
      </div>
      <Modal isOpen={isOpen} title={event.name} onClose={closeModal}>
        {isOpen && <EventEditor event={event} closeEditor={closeModal} />}
      </Modal>
    </div>
  );
};

export const EventCell = ({ event, schedulingError }: EventProps) => (
  <td colSpan={event.length}>
    <EventComponent event={event} schedulingError={schedulingError} />
  </td>
);
