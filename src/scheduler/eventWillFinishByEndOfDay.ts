import { SLOTS_PER_DAY } from "../consts";
import type { EventWithScheduleHelpers } from "../types";

export const eventWillFinishByEndOfDay = (startIdx: number, item: EventWithScheduleHelpers) =>
  (startIdx % SLOTS_PER_DAY) + item.length <= SLOTS_PER_DAY;
