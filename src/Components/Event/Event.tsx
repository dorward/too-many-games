import { useCallback, useState } from "react";
import type { Game } from "../../types";
import { Modal } from "../event-grid/Modal";
import { FaRegEdit } from "react-icons/fa";
import { PlayerList } from "../PlayerList/PlayerList";
import "./event.css";
import { ScheduledTime } from "../ScheduledTime/ScheduledTime";
import { Location } from "../Location/Location";
import { EventEditor } from "./EventEditor";

interface EventProps {
  event: Game;
  list?: boolean;
}

const EventComponent = ({ event }: EventProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);
  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  return (
    <div className="event">
      <header>
        <h2>{event.name}</h2>
        <button onClick={openModal} aria-label={`Open ${event.name}`}>
          <FaRegEdit />
        </button>
      </header>
      <div>
        <div className="row">
          <ScheduledTime event={event} />
          <Location event={event} />
        </div>
        <PlayerList playerIds={[event.facilitator, ...event.players]} />
      </div>
      <Modal isOpen={isOpen} title={event.name} onClose={closeModal}>
        {isOpen && <EventEditor event={event} />}
      </Modal>
    </div>
  );
};

export const Event = ({ event, list }: EventProps) => {
  const inList = list ?? false;
  if (inList) {
    return <EventComponent event={event} />;
  }

  return (
    <td colSpan={event.length}>
      <EventComponent event={event} />
    </td>
  );
};
