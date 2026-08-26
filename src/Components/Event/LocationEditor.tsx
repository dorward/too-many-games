import { useCallback, useMemo } from "react";
import type { AppData, Event } from "../../types";

interface LocationEditorProps {
  location: Event["location"];
  locations: AppData["locations"];
  setLocation: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const LocationEditor = ({ location, locations, setLocation }: LocationEditorProps) => {
  const options = useMemo(
    () => locations.map((option) => ({ label: option.name, value: option.id })),
    [locations],
  );

  const onChange = useCallback<React.ChangeEventHandler<HTMLSelectElement, HTMLSelectElement>>(
    (e) => {
      setLocation(e.currentTarget.value || undefined);
    },
    [setLocation],
  );

  return (
    <label>
      Location{" "}
      <select value={location ?? ""} onChange={onChange}>
        <option value="">Unscheduled</option>
        {options?.map(({ value, label }) => (
          <option key={value} value={value} label={label} />
        ))}
      </select>
    </label>
  );
};
