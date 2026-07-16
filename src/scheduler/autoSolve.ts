// oxlint-disable max-statements oxc/no-map-spread
import type { AppData, Game } from "../types";
import { generateSlotIds } from "./generateSlotIds";

const DEFAULT_TIME_LIMIT = 1000;

interface Placement {
  startIdx: number;
  locationId: string;
}

// oxlint-disable-next-line max-lines-per-function
export const autoSolve = (data: AppData, options: { timeLimitMs?: number } = {}): Game[] => {
  const { slots } = generateSlotIds(data.dates);
  const { locations } = data;
  const games = data.events;

  const autoLocationIds = new Set(locations.filter((l) => l.autoAllocation).map((l) => l.id));
  const allLocationIds = locations.map((l) => l.id);

  const items = games.map((game) => {
    const participants = new Set([game.facilitator, ...game.players]);
    const preferredLocs = game.preferredSpace.filter((id) => allLocationIds.includes(id));
    const fallbackLocs = allLocationIds.filter(
      (id) => autoLocationIds.has(id) && !preferredLocs.includes(id),
    );
    return { fallbackLocs, game, length: game.length, participants, preferredLocs };
  });

  // Hardest games first: long games, then most players, then difficult locations.
  items.sort((a, b) => {
    const lengthDiff = b.length - a.length;
    if (lengthDiff !== 0) {
      return lengthDiff;
    }
    const playerDiff = b.participants.size - a.participants.size;
    if (playerDiff !== 0) {
      return playerDiff;
    }
    return a.preferredLocs.length + a.fallbackLocs.length - b.preferredLocs.length;
  });

  const slotLocations = new Map<string, Set<string>>();
  const slotPlayers = new Map<string, Set<string>>();
  const assignments = new Map<string, { startSlot: string; location: string }>();

  let bestCount = 0;
  let bestAssignments = new Map<string, { startSlot: string; location: string }>();

  const startTime = Date.now();
  const timeLimit = options.timeLimitMs ?? DEFAULT_TIME_LIMIT;

  const canPlace = (
    item: (typeof items)[number],
    startIdx: number,
    locationId: string,
  ): boolean => {
    if (startIdx + item.length > slots.length) {
      return false;
    }
    if ((startIdx % 3) + item.length > 3) {
      return false;
    }

    for (let offset = 0; offset < item.length; offset++) {
      const slot = slots[startIdx + offset];
      if (slotLocations.get(slot)?.has(locationId)) {
        return false;
      }
      const occupiedPlayers = slotPlayers.get(slot);
      if (occupiedPlayers) {
        for (const player of item.participants) {
          if (occupiedPlayers.has(player)) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const getPlacements = (item: (typeof items)[number]): Placement[] => {
    const preferred: Placement[] = [];
    const fallback: Placement[] = [];
    slots.forEach((_slot, startIdx) => {
      if (startIdx + item.length > slots.length) {
        return;
      }
      for (const locationId of item.preferredLocs) {
        if (canPlace(item, startIdx, locationId)) {
          preferred.push({ locationId, startIdx });
        }
      }
      for (const locationId of item.fallbackLocs) {
        if (canPlace(item, startIdx, locationId)) {
          fallback.push({ locationId, startIdx });
        }
      }
    });

    return [...preferred, ...fallback];
  };

  const place = (item: (typeof items)[number], startIdx: number, locationId: string) => {
    for (let offset = 0; offset < item.length; offset++) {
      const slot = slots[startIdx + offset];
      if (!slotLocations.has(slot)) {
        slotLocations.set(slot, new Set());
      }
      slotLocations.get(slot)!.add(locationId);
      if (!slotPlayers.has(slot)) {
        slotPlayers.set(slot, new Set());
      }
      for (const player of item.participants) {
        slotPlayers.get(slot)!.add(player);
      }
    }
    assignments.set(item.game.id, {
      location: locationId,
      startSlot: slots[startIdx],
    });
  };

  const unplace = (item: (typeof items)[number], startIdx: number, locationId: string) => {
    for (let offset = 0; offset < item.length; offset++) {
      const slot = slots[startIdx + offset];
      slotLocations.get(slot)!.delete(locationId);
      const occupied = slotPlayers.get(slot)!;
      for (const player of item.participants) {
        occupied.delete(player);
      }
    }
    assignments.delete(item.game.id);
  };

  const recordBest = (scheduledCount: number) => {
    if (scheduledCount > bestCount) {
      bestCount = scheduledCount;
      bestAssignments = new Map(assignments);
    }
  };

  const search = (index: number, scheduledCount: number) => {
    if (Date.now() - startTime > timeLimit) {
      return;
    }
    recordBest(scheduledCount);

    const remaining = items.length - index;
    if (scheduledCount + remaining <= bestCount) {
      return;
    }
    if (index === items.length) {
      return;
    }

    const item = items[index];
    const placements = getPlacements(item);

    for (const { startIdx, locationId } of placements) {
      place(item, startIdx, locationId);
      search(index + 1, scheduledCount + 1);
      unplace(item, startIdx, locationId);
    }

    // Also try leaving this game unscheduled.
    search(index + 1, scheduledCount);
  };

  search(0, 0);

  return games.map((game) => {
    const assignment = bestAssignments.get(game.id);
    if (!assignment) {
      return game;
    }
    return {
      ...game,
      location: assignment.location,
      startSlot: assignment.startSlot,
    };
  });
};
