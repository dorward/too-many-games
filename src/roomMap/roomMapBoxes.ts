// These coordinates are deliberately a provisional room-to-box assignment.
// oxlint-disable no-magic-numbers sort-keys
import type { RoomNumber } from "../types";

export const ROOM_MAP_SIZE = {
  height: 1625,
  width: 2403,
} as const;

export interface MapBox {
  height: number;
  width: number;
  x: number;
  y: number;
}

export const ROOM_BOXES = {
  1: { height: 150, width: 346, x: 98, y: 479 },
  10: { height: 150, width: 346, x: 1100, y: 1431 },
  11: { height: 150, width: 346, x: 859, y: 1254 },
  12: { height: 150, width: 346, x: 562, y: 1431 },
  16: { height: 150, width: 346, x: 2021, y: 507 },
  14: { height: 150, width: 346, x: 2021, y: 91 },
  15: { height: 150, width: 346, x: 2021, y: 348 },
  13: { height: 150, width: 346, x: 98, y: 1057 },
  17: { height: 150, width: 346, x: 1809, y: 686 },
  2: { height: 150, width: 346, x: 639, y: 235 },
  3: { height: 150, width: 346, x: 826, y: 407 },
  4: { height: 150, width: 346, x: 1029, y: 235 },
  5: { height: 150, width: 346, x: 1199, y: 407 },
  6: { height: 150, width: 346, x: 1440, y: 686 },
  7: { height: 150, width: 346, x: 1979, y: 985 },
  8: { height: 150, width: 346, x: 1737, y: 1163 },
  9: { height: 150, width: 346, x: 1309, y: 1254 },
} as const satisfies Record<RoomNumber, MapBox>;
