import { useContext } from "react";
import { tooManyGamesContext } from "./tooManyGamesContext";

export const useTooManyGamesData = () => {
  const context = useContext(tooManyGamesContext);
  if (context === null) {throw new Error("Missing TooManyGamesProvider");}
  return context;
};
