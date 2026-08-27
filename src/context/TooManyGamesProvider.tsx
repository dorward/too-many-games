import { type ReactNode, useCallback, useMemo, useState } from "react";
import { tooManyGamesContext } from "./tooManyGamesContext";
import type { AppData, Event } from "../types";

export const TooManyGamesProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AppData | null>(null);

  const updateEvent = useCallback((eventId: string, update: Partial<Event>) => {
    setData((current) => {
      if (current === null) {
        return current;
      }

      const events = current.events.map((event) => {
        if (event.id !== eventId) {
          return event;
        }
        return { ...event, ...update };
      });

      return { ...current, events };
    });
  }, []);

  const value = useMemo(() => ({ data, setData, updateEvent }), [data, setData, updateEvent]);

  return <tooManyGamesContext.Provider value={value}>{children}</tooManyGamesContext.Provider>;
};
