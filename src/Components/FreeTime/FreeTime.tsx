import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import { generateSlotIds } from "../../scheduler/generateSlotIds";
import { FreeTimeTable } from "./FreeTimeTable";
import { getOccupiedSlotIdsByAttendee } from "./getOccupiedSlotIdsByAttendee";
import "../PlayerList/playerList.css";
import "./freeTime.css";

export const FreeTime = () => {
  const { data } = useTooManyGamesData();
  if (data === null) {
    return "Error";
  }

  const { slots } = generateSlotIds(data.dates);
  const occupiedSlotIdsByAttendee = getOccupiedSlotIdsByAttendee(data.events);
  const attendees = data.attendees.toSorted((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="free-time">
      <h2>Free Time</h2>
      <div className="free-time-table-container">
        <FreeTimeTable
          attendees={attendees}
          occupiedSlotIdsByAttendee={occupiedSlotIdsByAttendee}
          slots={slots}
        />
      </div>
    </section>
  );
};
