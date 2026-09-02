import type { Event, Location } from "../../types";
import { describeSchedule } from "../../scheduler/describeSchedule";
import { getLocationName } from "./eventListTable";

interface EventListBodyProps {
  events: Event[];
  locationNamesById: Map<Location["id"], Location["name"]>;
}

export const EventListBody = ({ events, locationNamesById }: EventListBodyProps) => (
  <tbody>
    {events.map((event) => {
      const isNotPreferredLocation =
        event.preferredSpace.length > 0 &&
        event.location !== undefined &&
        !event.preferredSpace.includes(event.location);

      return (
        <tr key={event.id}>
          <td className="event-list-event">{event.name}</td>
          <td className="event-list-players">{event.players.length}</td>
          <td className="event-list-max-seats">{event.playerCount.max}</td>
          <td className="event-list-scheduled">{describeSchedule(event)}</td>
          <td
            className={`event-list-location${isNotPreferredLocation ? " not-preferred-location" : ""}`}
          >
            {getLocationName(event, locationNamesById)}
          </td>
        </tr>
      );
    })}
  </tbody>
);
