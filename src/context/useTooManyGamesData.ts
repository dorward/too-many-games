import { useContext } from "react";
import { TooManyGamesContext } from "./TooManyGamesContext";

export const useTooManyGamesData = () => {
  const context = useContext(TooManyGamesContext);
  if (context === null) throw new Error("Missing TooManyGamesProvider");
  return context;
};
