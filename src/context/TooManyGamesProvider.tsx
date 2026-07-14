import { useState, type ReactNode } from "react";
import type { AppData } from "../../types";
import { TooManyGamesContext } from "./TooManyGamesContext";

export const TooManyGamesProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AppData | null>(null);

  return (
    <TooManyGamesContext.Provider value={{ data, setData }}>
      {children}
    </TooManyGamesContext.Provider>
  );
};
