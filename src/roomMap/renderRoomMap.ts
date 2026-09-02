import type { RoomAllocation } from "../types";
import { getRoomMapCells } from "./getRoomMapCells";
import { ROOM_BOXES, ROOM_MAP_SIZE, type MapBox } from "./roomMapBoxes";

const DIVIDER_INSET = 8;
const DIVIDER_WIDTH = 4;
const FONT_FAMILY = 'system-ui, "Segoe UI", sans-serif';
const FONT_WEIGHT = 600;
const MAX_FONT_SIZE = 34;
const MIN_FONT_SIZE = 12;
const TEXT_HORIZONTAL_PADDING = 12;

const setLargestFittingFont = (
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) => {
  let fontSize = MAX_FONT_SIZE;
  context.font = `${FONT_WEIGHT} ${fontSize}px ${FONT_FAMILY}`;
  while (
    fontSize > MIN_FONT_SIZE &&
    context.measureText(text).width > maxWidth - TEXT_HORIZONTAL_PADDING * 2
  ) {
    fontSize--;
    context.font = `${FONT_WEIGHT} ${fontSize}px ${FONT_FAMILY}`;
  }
};

const drawDivider = (
  context: CanvasRenderingContext2D,
  box: MapBox,
  layout: RoomAllocation["layout"],
) => {
  if (layout === "single") {
    return;
  }

  context.beginPath();
  context.lineWidth = DIVIDER_WIDTH;
  context.strokeStyle = "#000000";
  if (layout === "double") {
    const x = box.x + box.width / 2;
    context.moveTo(x, box.y + DIVIDER_INSET);
    context.lineTo(x, box.y + box.height - DIVIDER_INSET);
  } else {
    const y = box.y + box.height / 2;
    context.moveTo(box.x + DIVIDER_INSET, y);
    context.lineTo(box.x + box.width - DIVIDER_INSET, y);
  }
  context.stroke();
};

const drawOccupant = (context: CanvasRenderingContext2D, name: string, cell: MapBox) => {
  setLargestFittingFont(context, name, cell.width);
  context.fillStyle = "#000000";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(name, cell.x + cell.width / 2, cell.y + cell.height / 2);
};

export const renderRoomMap = (
  canvas: HTMLCanvasElement,
  mapImage: HTMLImageElement,
  roomAllocations: RoomAllocation[],
  attendeeNamesById: Map<string, string>,
) => {
  if (
    mapImage.naturalWidth !== ROOM_MAP_SIZE.width ||
    mapImage.naturalHeight !== ROOM_MAP_SIZE.height
  ) {
    throw new Error(
      `Expected map dimensions ${ROOM_MAP_SIZE.width}×${ROOM_MAP_SIZE.height}, but found ${mapImage.naturalWidth}×${mapImage.naturalHeight}`,
    );
  }

  const context = canvas.getContext("2d");
  if (context === null) {
    throw new Error("Could not create the room map canvas");
  }

  context.clearRect(0, 0, ROOM_MAP_SIZE.width, ROOM_MAP_SIZE.height);
  context.drawImage(mapImage, 0, 0, ROOM_MAP_SIZE.width, ROOM_MAP_SIZE.height);

  for (const room of roomAllocations) {
    const box = ROOM_BOXES[room.roomNumber];
    const cells = getRoomMapCells(box, room.layout);
    drawDivider(context, box, room.layout);
    room.occupantIds.forEach((attendeeId, index) => {
      const cell = cells[index];
      const name = attendeeId === null ? undefined : attendeeNamesById.get(attendeeId);
      if (cell !== undefined && name !== undefined) {
        drawOccupant(context, name, cell);
      }
    });
  }
};
