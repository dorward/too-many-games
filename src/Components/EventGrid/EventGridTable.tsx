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
        <th>Morning (10am-2pm)</th>
        <th>Afternoon (2pm-6pm)</th>
        <th>Evening (6pm-10pm)</th>
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
