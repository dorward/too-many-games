import { FaCalendarCheck, FaDownload, FaUpload } from "react-icons/fa";
import "./menu.css";
import { isView, type View } from "../../types";
import { useUploadData } from "../uploadData/useUploadData";
import { Navigation } from "./Navigation";

interface MenuProps {
  setView: React.Dispatch<React.SetStateAction<View>>;
  view: View;
}

export const Menu = ({ setView, view }: MenuProps) => {
  const changePage: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"] = (event) => {
    const goto = event.currentTarget.value;
    if (isView(goto)) {
      setView(goto);
    }
  };

  const { onLoad, onSave, onSchedule } = useUploadData();

  return (
    <div className="menu">
      <h1>Event Scheduler</h1>
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
        <button aria-label="Run auto-scheduler" title="Run auto-scheduler" onClick={onSchedule}>
          <FaCalendarCheck />
        </button>
      </div>
    </div>
  );
};
