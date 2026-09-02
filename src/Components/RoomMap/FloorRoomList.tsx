import type { RoomAllocation } from "../../types";
import { PlayerList } from "../PlayerList/PlayerList";

interface FloorRoomListProps {
  heading: string;
  roomAllocations: RoomAllocation[];
}

export const FloorRoomList = ({ heading, roomAllocations }: FloorRoomListProps) => (
  <section className="room-map-floor">
    <h3>{heading}</h3>
    <ul className="room-map-room-list">
      {roomAllocations.map((room) => {
        const occupantIds = room.occupantIds.filter((id): id is string => id !== null);
        const playerCount = {
          desirable: occupantIds.length,
          max: occupantIds.length,
          min: occupantIds.length,
        };
        return (
          <li className="room-map-room" key={room.roomNumber}>
            <h4>Room {room.roomNumber}</h4>
            {occupantIds.length === 0 ? (
              <p>Unoccupied</p>
            ) : (
              <PlayerList
                facilitatorId=""
                playerCount={playerCount}
                playerIds={occupantIds}
                waitListIds={[]}
              />
            )}
          </li>
        );
      })}
    </ul>
  </section>
);
