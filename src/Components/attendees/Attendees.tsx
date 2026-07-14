import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import { gamesPerAttendee } from "../../data/derive/gamesPerAttendee";
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
          const { games, waitList } = gamesPerAttendee(a, data);
          return (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{games}</td>
              <td>{waitList}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
