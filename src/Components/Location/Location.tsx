import { useContext } from "react";
import { TooManyGamesContext } from "../../context/TooManyGamesContext";
import type { Game } from "../../types";

interface LocationProps {
  event: Game;
}

export const Location = ({ event }: LocationProps) => {
  const context = useContext(TooManyGamesContext);
  const locations = context?.data?.locations;
  if (!locations) {return <div className="location" />;}
  const location = locations.find((l) => l.id === event.location);
  return <div className="location">{location?.name}</div>;
};
