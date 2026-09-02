import type { AppData } from "../../types";
import { FloorRoomList } from "./FloorRoomList";

const LAST_FIRST_FLOOR_ROOM = 13;

interface RoomListsProps {
  roomAllocations: AppData["roomAllocations"];
}

export const RoomLists = ({ roomAllocations }: RoomListsProps) => (
  <div className="room-map-floor-lists">
    <FloorRoomList
      heading="First Floor"
      roomAllocations={roomAllocations.filter(
        ({ roomNumber }) => roomNumber <= LAST_FIRST_FLOOR_ROOM,
      )}
    />
    <FloorRoomList
      heading="Second Floor"
      roomAllocations={roomAllocations.filter(
        ({ roomNumber }) => roomNumber > LAST_FIRST_FLOOR_ROOM,
      )}
    />
  </div>
);
