import { useCallback, useMemo } from "react";
import type { AppData, Game } from "../../types";

interface LocationEditorProps {
  locations: AppData["locations"];
  event: Game;
  setLocation: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const LocationEditor = ({ locations, event, setLocation }: LocationEditorProps) => {
  const options = useMemo(
    () => locations.map((location) => ({ label: location.name, value: location.id })),
    [locations],
  );

  const onChange = useCallback<React.ChangeEventHandler<HTMLSelectElement, HTMLSelectElement>>(
    (e) => {
      setLocation(e.currentTarget.value);
    },
    [setLocation],
  );

  return (
    <label>
      Location{" "}
      <select value={event.location} onChange={onChange}>
        {options?.map(({ value, label }) => (
          <option key={value} value={value} label={label} />
        ))}
      </select>
    </label>
  );
};
