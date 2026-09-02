import type { BedLayout } from "../types";
import type { MapBox } from "./roomMapBoxes";

const BOX_INSET = 8;
const CELL_COUNT = 2;

const insetBox = ({ x, y, width, height }: MapBox): MapBox => ({
  height: height - BOX_INSET * CELL_COUNT,
  width: width - BOX_INSET * CELL_COUNT,
  x: x + BOX_INSET,
  y: y + BOX_INSET,
});

export const getRoomMapCells = (box: MapBox, layout: BedLayout): MapBox[] => {
  const content = insetBox(box);
  if (layout === "single") {
    return [content];
  }
  if (layout === "double") {
    const width = content.width / CELL_COUNT;
    return [
      { ...content, width },
      { ...content, width, x: content.x + width },
    ];
  }

  const height = content.height / CELL_COUNT;
  return [
    { ...content, height },
    { ...content, height, y: content.y + height },
  ];
};
