import { useContext } from "react";
import { TooManyGamesContext } from "../../context/TooManyGamesContext";
import type { Event } from "../../types";

interface LocationProps {
  event: Event;
  hasError?: boolean;
}

export const Location = ({ event, hasError = false }: LocationProps) => {
  const context = useContext(TooManyGamesContext);
  const locations = context?.data?.locations;
  const className = hasError ? "location error" : "location";
  if (!locations) {
    return <div className={className} />;
  }
  const location = locations.find((l) => l.id === event.location);
  return <div className={className}>{location?.name}</div>;
};
