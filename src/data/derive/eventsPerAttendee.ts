import type { AppData, Attendee } from "../../types";

export const eventsPerAttendee = (attendee: Attendee, data: AppData) =>
  data.events.reduce(
    (counts, current) => {
      if (current.players.includes(attendee.id)) {
        return { events: counts.events + 1, waitList: counts.waitList };
      }
      if (current.waitList.includes(attendee.id)) {
        return { events: counts.events, waitList: counts.waitList + 1 };
      }

      return counts;
    },
    { events: 0, waitList: 0 },
  );
