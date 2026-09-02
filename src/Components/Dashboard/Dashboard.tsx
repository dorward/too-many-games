import { useState } from "react";
import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import type { View } from "../../types";
import { Menu } from "../Menu/Menu";
import { Attendees } from "../Attendees/Attendees";
import { EventList } from "../EventList/EventList";
import { EventGrid } from "../EventGrid/EventGrid";
import { useUploadData } from "../UploadData/useUploadData";
import { Schedules } from "../EventList/Schedules/Schedules";
import { SignupSheets } from "../SignupSheets/SignupSheets";
import { RoomMap } from "../RoomMap/RoomMap";

export const Dashboard = () => {
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
      {view === "room-map" && <RoomMap />}
      {view === "signup-sheets" && (
        <SignupSheets participantFilter={uploadData.participantFilter} />
      )}
    </>
  );
};
