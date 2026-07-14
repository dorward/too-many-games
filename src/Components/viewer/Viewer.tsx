import { useState } from "react";
import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import type { View } from "../../types";
import { Menu } from "../menu/Menu";
import { Attendees } from "../attendees/Attendees";
import { EventList } from "../event-list/EventList";
import { EventGrid } from "../event-grid/EventGrid";

export const Viewer = () => {
  const context = useTooManyGamesData();
  const [view, setView] = useState<View>("event-list");
  if (!context.data) {
    return "Error";
  }
  return (
    <>
      <Menu setView={setView} view={view} />
      {view === "attendees" && <Attendees />}
      {view === "event-list" && <EventList />}
      {view === "event-grid" && <EventGrid />}
    </>
  );
};
