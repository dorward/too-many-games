import type { AppData, Attendee } from "../../types";

export const gamesPerAttendee = (attendee: Attendee, data: AppData) => 
  data.events.reduce(
    (counts, current) => {
      if (current.players.includes(attendee.id)) {
        return { games: counts.games + 1, waitList: counts.waitList };
      }
      if (current.waitList.includes(attendee.id)) {
        return { games: counts.games, waitList: counts.waitList + 1 };
      }

      return counts;
    },
    { games: 0, waitList: 0 },
  )
;
