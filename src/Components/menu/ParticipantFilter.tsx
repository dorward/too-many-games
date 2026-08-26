import type { Attendee } from "../../types";

export interface ParticipantFilterProps {
  onParticipantFilterChange: React.ChangeEventHandler<HTMLSelectElement>;
  participantFilter: string;
  participantOptions: Attendee[];
}

export const ParticipantFilter = ({
  onParticipantFilterChange,
  participantFilter,
  participantOptions,
}: ParticipantFilterProps) => (
  <label>
    Filter:{" "}
    <select value={participantFilter} onChange={onParticipantFilterChange}>
      <option value="">Unfiltered</option>
      {participantOptions.map(({ id, name }) => (
        <option key={id} value={id}>
          {name}
        </option>
      ))}
    </select>
  </label>
);
