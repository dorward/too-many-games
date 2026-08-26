// oxlint-disable max-lines-per-function
import { FaDownload, FaUpload } from "react-icons/fa";
import "./menu.css";
import { isView, type Attendee, type View } from "../../types";
import { Navigation } from "./Navigation";
import { Processing } from "./Processing";
import { ParticipantFilter } from "./ParticipantFilter";
import { useCallback } from "react";
import { ScheduleControl } from "./ScheduleControl";
import { ClearScheduleControl } from "./ClearScheduleControl";

interface MenuProps {
  countdown: null | number;
  onClearSchedule: () => void;
  onLoad: () => void;
  onParticipantFilterChange: React.ChangeEventHandler<HTMLSelectElement>;
  onSave: () => void;
  onSchedule: () => Promise<boolean>;
  participantFilter: string;
  participantOptions: Attendee[];
  setView: React.Dispatch<React.SetStateAction<View>>;
  view: View;
}

export const Menu = ({
  countdown,
  onClearSchedule,
  onLoad,
  onParticipantFilterChange,
  onSave,
  onSchedule,
  participantFilter,
  participantOptions,
  setView,
  view,
}: MenuProps) => {
  const changePage: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"] = useCallback(
    (event) => {
      const goto = event.currentTarget.value;
      if (isView(goto)) {
        setView(goto);
      }
    },
    [setView],
  );

  return (
    <div className="menu">
      <h1>Event Scheduler</h1>
      <div className="buttons">
        <div className="button-group">
          <Navigation changePage={changePage} currentView={view} />
        </div>
        <div className="button-group">
          <button aria-label="Save" title="Save" onClick={onSave}>
            <FaDownload />
          </button>
          <button aria-label="Load" title="Load" onClick={onLoad}>
            <FaUpload />
          </button>
          <ScheduleControl onSchedule={onSchedule} />
          <ClearScheduleControl onClearSchedule={onClearSchedule} />
          <ParticipantFilter
            onParticipantFilterChange={onParticipantFilterChange}
            participantFilter={participantFilter}
            participantOptions={participantOptions}
          />
        </div>
      </div>
      {countdown !== null && <Processing ms={countdown} />}
    </div>
  );
};
