import type { Event } from "../../types";

export const getCountClassName = (index: number, playerCount: Event["playerCount"]) => {
  if (index <= playerCount.min) {
    return "count-within-min";
  }
  if (index <= playerCount.desirable) {
    return "count-within-desirable";
  }
  if (index <= playerCount.max) {
    return "count-within-max";
  }
  return "count-waitlisted";
};
