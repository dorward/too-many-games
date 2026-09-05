import type { Event } from "../../types";
import type { SchedulingError } from "../../scheduler/getSchedulingErrors";
import { useCallback, useState } from "react";
import { Modal } from "../EventGrid/Modal";
import { FaRegEdit } from "react-icons/fa";
import { PlayerList } from "../PlayerList/PlayerList";
import { ScheduledTime } from "../ScheduledTime/ScheduledTime";
import { Location } from "../Location/Location";
import { EventEditor } from "./EventEditor/EventEditor";
import { UnscheduleButton } from "./UnscheduleButton";
import "./event.css";

interface EventProps {
  event: Event;
  schedulingError?: SchedulingError;
}

export const EventCard = ({ event, schedulingError }: EventProps) => {
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
        <div className="event-card-actions">
          <UnscheduleButton event={event} />
          <button onClick={openModal} aria-label={openMsg} title={openMsg} type="button">
            <FaRegEdit />
          </button>
        </div>
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
