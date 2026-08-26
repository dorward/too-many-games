import { useState } from "react";
import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import type { View } from "../../types";
import { Menu } from "../menu/Menu";
import { Attendees } from "../attendees/Attendees";
import { EventList } from "../event-list/EventList";
import { EventGrid } from "../event-grid/EventGrid";
import { useUploadData } from "../upload-data/useUploadData";
import { Schedules } from "../event-list/schedules/Schedules";
import { SignupSheets } from "../signup-sheets/SignupSheets";

export const Viewer = () => {
  const context = useTooManyGamesData();
  const [view, setView] = useState<View>("event-list");
  const uploadData = useUploadData();
  const {
    onClearSchedule: handleClearSchedule,
    onLoad: handleLoad,
    onParticipantFilterChange: handleParticipantFilterChange,
    onSave: handleSave,
    onSchedule: handleSchedule,
  } = uploadData;
  if (!context.data) {
    return "Error";
  }
  return (
    <>
      <Menu
        countdown={uploadData.countdown}
        onClearSchedule={handleClearSchedule}
        onLoad={handleLoad}
        onParticipantFilterChange={handleParticipantFilterChange}
        onSave={handleSave}
        onSchedule={handleSchedule}
        participantFilter={uploadData.participantFilter}
        participantOptions={uploadData.participantOptions}
        setView={setView}
        view={view}
      />
      {view === "attendees" && <Attendees />}
      {view === "event-list" && <EventList participantFilter={uploadData.participantFilter} />}
      {view === "event-grid" && <EventGrid participantFilter={uploadData.participantFilter} />}
      {view === "schedules" && <Schedules participantFilter={uploadData.participantFilter} />}
      {view === "signup-sheets" && (
        <SignupSheets participantFilter={uploadData.participantFilter} />
      )}
    </>
  );
};
