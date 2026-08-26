import type { OrganisedScheduleDays } from "../../types";
import type { SchedulingErrors } from "../../scheduler/getSchedulingErrors";
import { EventGridBody } from "./EventGridBody";

interface EventGridTableProps {
  maxGamesPerDay: Record<string, number>;
  schedule: OrganisedScheduleDays;
  schedulingErrors: SchedulingErrors;
}

export const EventGridTable = ({
  maxGamesPerDay,
  schedule,
  schedulingErrors,
}: EventGridTableProps) => (
  <table className="eventGrid">
    <colgroup>
      <col />
      <col />
      <col />
      <col />
    </colgroup>
    <thead>
      <tr>
        <th>Day</th>
        <th>Morning</th>
        <th>Afternoon</th>
        <th>Evening</th>
      </tr>
    </thead>
    <tbody>
      <EventGridBody
        maxEventsPerDay={maxGamesPerDay}
        schedule={schedule}
        schedulingErrors={schedulingErrors}
      />
    </tbody>
  </table>
);
