import type { SchedulingErrors } from "../../scheduler/getSchedulingErrors";
import type { AppData } from "../../types";

export interface ScheduleIssue {
  id: string;
  message: string;
}

export const getScheduleIssues = (
  data: AppData,
  schedulingErrors: SchedulingErrors,
): ScheduleIssue[] => {
  const attendeeNamesById = new Map(data.attendees.map(({ id, name }) => [id, name]));
  const locationNamesById = new Map(data.locations.map(({ id, name }) => [id, name]));
  const issues: ScheduleIssue[] = [];

  for (const event of data.events.toSorted((a, b) => a.name.localeCompare(b.name))) {
    if (event.startSlot === undefined && event.location === undefined) {
      issues.push({ id: `${event.id}-unscheduled`, message: `${event.name} is unscheduled.` });
    } else if (event.startSlot === undefined) {
      issues.push({ id: `${event.id}-slot`, message: `${event.name} has no time slot.` });
    } else if (event.location === undefined) {
      issues.push({ id: `${event.id}-location`, message: `${event.name} has no location.` });
    }

    const error = schedulingErrors.get(event.id);
    if (error?.location) {
      const locationName = locationNamesById.get(event.location ?? "") ?? "The location";
      issues.push({
        id: `${event.id}-location-conflict`,
        message: `${event.name}: ${locationName} is already in use at this time.`,
      });
    }

    const participantNames = [...(error?.participantIds ?? [])]
      .map((id) => attendeeNamesById.get(id) ?? "Unknown attendee")
      .toSorted((a, b) => a.localeCompare(b));
    if (participantNames.length > 0) {
      issues.push({
        id: `${event.id}-attendee-conflict`,
        message: `${event.name}: already scheduled at this time — ${participantNames.join(", ")}.`,
      });
    }
  }

  return issues;
};
