import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import { describeSchedule } from "../../scheduler/describeSchedule";

export const EventList = () => {
  const context = useTooManyGamesData();
  const { data } = context;
  if (!data) {
    return "Error";
  }
  return (
    <table className="event-list">
      <thead>
        <tr>
          <th>Event</th>
          <th>Players</th>
          <th>Max Seats</th>
          <th>Scheduled</th>
        </tr>
      </thead>
      <tbody>
        {data.events.map((event) => (
          <tr key={event.id}>
            <td>{event.name}</td>
            <td>{event.players.length}</td>
            <td>{event.playerCount.max}</td>
            <td>{describeSchedule(event)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
