import type { AttendeeRow } from "./attendeesTableTypes";

interface AttendeesBodyProps {
  attendees: AttendeeRow[];
}

export const AttendeesBody = ({ attendees }: AttendeesBodyProps) => (
  <tbody>
    {attendees.map(({ attendee, events, facilitator, waitList }) => (
      <tr key={attendee.id}>
        <td>{attendee.name}</td>
        <td>{events}</td>
        <td>{facilitator}</td>
        <td>{waitList}</td>
      </tr>
    ))}
  </tbody>
);
