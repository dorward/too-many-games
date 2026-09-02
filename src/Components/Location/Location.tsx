import { useContext } from "react";
import { tooManyGamesContext } from "../../context/tooManyGamesContext";
import type { Event } from "../../types";

interface LocationProps {
  event: Event;
  hasError?: boolean;
}

export const Location = ({ event, hasError = false }: LocationProps) => {
  const context = useContext(tooManyGamesContext);
  const locations = context?.data?.locations;
  const className = [
    "location",
    hasError && "error",
    event.preferredSpace.length > 0 &&
      event.location !== undefined &&
      !event.preferredSpace.includes(event.location) &&
      "not-preferred-location",
  ]
    .filter(Boolean)
    .join(" ");
  if (!locations) {
    return <div className={className} />;
  }
  const location = locations.find((l) => l.id === event.location);
  return <div className={className}>{location?.name}</div>;
};
