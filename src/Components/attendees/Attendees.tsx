import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import { eventsPerAttendee } from "../../data/derive/eventsPerAttendee";
import "./attendees.css";

export const Attendees = () => {
  const context = useTooManyGamesData();
  const { data } = context;
  if (!data) {
    return "Error";
  }
  return (
    <table className="attendees">
      <thead>
        <tr>
          <th>Name</th>
          <th>Games</th>
          <th>Wait Listed</th>
        </tr>
      </thead>
      <tbody>
        {data.attendees.map((a) => {
          const { events, waitList } = eventsPerAttendee(a, data);
          return (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{events}</td>
              <td>{waitList}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
