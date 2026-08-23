import type { Assignment, Event } from "../types";

/**
 * Takes an array of events and updates their
 * and startSlot with new assignments.
 *
 * @param {Event[]} events
 * @param {Map<string, Assignment>} assignments
 * @returns {*}
 */
export const applyAssignmentsToEvents = (
  events: Event[],
  assignments: Map<string, Assignment>,
): Event[] =>
  events.map((event) => {
    const assignment = assignments.get(event.id);
    if (!assignment) {
      return event;
    }
    return {
      ...event,
      location: assignment.location,
      startSlot: assignment.startSlot,
    };
  });
