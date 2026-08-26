import type { AppData, Attendee } from "../../types";

export const eventsPerAttendee = (attendee: Attendee, data: AppData) =>
  data.events.reduce(
    (counts, current) => {
      if (current.facilitator === attendee.id && !current.players.includes(attendee.id)) {
        return {
          events: counts.events,
          facilitator: counts.facilitator + 1,
          waitList: counts.waitList,
        };
      }
      if (current.players.includes(attendee.id)) {
        return {
          events: counts.events + 1,
          facilitator: counts.facilitator,
          waitList: counts.waitList,
        };
      }
      if (current.waitList.includes(attendee.id)) {
        return {
          events: counts.events,
          facilitator: counts.facilitator,
          waitList: counts.waitList + 1,
        };
      }

      return counts;
    },
    { events: 0, facilitator: 0, waitList: 0 },
  );
