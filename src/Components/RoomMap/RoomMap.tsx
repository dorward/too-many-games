import { useMemo, useRef } from "react";
import { FaDownload } from "react-icons/fa";
import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import { ROOM_MAP_SIZE } from "../../roomMap/roomMapBoxes";
import { RoomLists } from "./RoomLists";
import { useDownloadRoomMap } from "./useDownloadRoomMap";
import { useRenderRoomMap } from "./useRenderRoomMap";
import "./roomMap.css";

export const RoomMap = () => {
  const { data } = useTooManyGamesData();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const attendees = data?.attendees;
  const attendeeNamesById = useMemo(
    () => new Map(attendees?.map(({ id, name }) => [id, name]) ?? []),
    [attendees],
  );
  const { isReady, renderingError, setRenderingError } = useRenderRoomMap(
    canvasRef,
    data,
    attendeeNamesById,
  );
  const download = useDownloadRoomMap(canvasRef, setRenderingError);

  if (data === null) {
    return "Error";
  }

  return (
    <section className="room-map">
      <header className="room-map-header">
        <button disabled={!isReady} onClick={() => void download()} type="button">
          <FaDownload /> Download PNG
        </button>
      </header>
      {renderingError !== null && (
        <p className="room-map-error" role="alert">
          {renderingError}
        </p>
      )}
      {!isReady && renderingError === null && <p role="status">Rendering room map…</p>}
      <canvas
        aria-label="Building map showing attendee room allocations"
        height={ROOM_MAP_SIZE.height}
        ref={canvasRef}
        role="img"
        width={ROOM_MAP_SIZE.width}
      />
      <RoomLists roomAllocations={data.roomAllocations} />
    </section>
  );
};
