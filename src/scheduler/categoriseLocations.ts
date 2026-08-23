import type { Location } from "../types";

/**
 * Splits an array of locations into those with the autoAllocation flag and those without
 *
 * @param {Location[]} locations
 * @returns {{ allLocationIds: any; autoLocationIds: any; }}
 */
export const categoriseLocations = (locations: Location[]) => {
  const autoLocationIds = new Set(locations.filter((l) => l.autoAllocation).map((l) => l.id));
  const allLocationIds = locations.map((l) => l.id);
  return { allLocationIds, autoLocationIds };
};
