import type { ScheduleIssue } from "./getScheduleIssues";

interface ScheduleErrorSummaryProps {
  issues: ScheduleIssue[];
}

export const ScheduleErrorSummary = ({ issues }: ScheduleErrorSummaryProps) => (
  <section
    aria-labelledby="schedule-summary-heading"
    className={`schedule-error-summary${issues.length > 0 ? " has-errors" : ""}`}
  >
    <h2 id="schedule-summary-heading">Schedule summary</h2>
    {issues.length === 0 ? (
      <p>No conflicts or scheduling errors.</p>
    ) : (
      <ul>
        {issues.map(({ id, message }) => (
          <li key={id}>{message}</li>
        ))}
      </ul>
    )}
  </section>
);
