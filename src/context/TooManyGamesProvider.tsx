import { type ReactNode, useCallback, useMemo, useState } from "react";
import { TooManyGamesContext } from "./TooManyGamesContext";
import type { AppData, Game } from "../types";

export const TooManyGamesProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AppData | null>(null);

  const updateEvent = useCallback(
    (eventId: string, update: Partial<Game>) => {
      if (!data?.events) {
        return;
      }

      const events = data.events.map((event) => {
        if (event.id !== eventId) {
          return event;
        }
        return { ...event, ...update };
      });

      setData({ ...data, events });
    },
    [data],
  );

  const value = useMemo(() => ({ data, setData, updateEvent }), [data, setData, updateEvent]);

  return <TooManyGamesContext.Provider value={value}>{children}</TooManyGamesContext.Provider>;
};
