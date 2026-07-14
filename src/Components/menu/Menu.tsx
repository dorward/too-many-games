import { FaDownload, FaUpload, FaCalendarCheck } from "react-icons/fa";
import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import "./menu.css";
import type { View } from "../../types";
import { autoSolve } from "../../scheduler/autoSolve";

type MenuProps = {
  setView: React.Dispatch<React.SetStateAction<View>>;
  view: View;
};

type NavButtonProps = React.PropsWithChildren<{
  value: View;
  changePage: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  currentView: View;
}>;

const NavButton = ({ value, children, changePage, currentView }: NavButtonProps) => (
  <button
    onClick={changePage}
    value={value}
    className={currentView === value ? "selected" : ""}
  >
    {children}
  </button>
);

export const Menu = ({ setView, view }: MenuProps) => {
  const context = useTooManyGamesData();

  const changePage: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"] = (event) => {
    const goto = event.currentTarget.value;
    setView(goto as View);
  };

  return (
    <div className="menu">
      <h1>Event Scheduler</h1>
      <div className="button-group">
        <NavButton currentView={view} changePage={changePage} value="attendees">
          Attendees
        </NavButton>
        <NavButton currentView={view} changePage={changePage} value="event-list">
          Event List
        </NavButton>
        <NavButton currentView={view} changePage={changePage} value="event-grid">
          Event Grid
        </NavButton>
      </div>
      <div className="button-group">
        <button
          aria-label="Save"
          title="Save"
          onClick={() => {
            const json = JSON.stringify(context.data, null, 2);
            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "eventData.json";
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
          }}
        >
          <FaDownload />
        </button>
        <button
          aria-label="Load"
          title="Load"
          onClick={() => {
            if (confirm("Discard all data and return to the load screen?")) {
              context.setData(null);
            }
          }}
        >
          <FaUpload />
        </button>
        <button
          aria-label="Run auto-scheduler"
          title="Run auto-scheduler"
          onClick={() => {
            if (!context.data) {
              alert("Missing event information. Cannot schedule");
              return;
            }
            if (confirm("Run auto-scheduler?")) {
              const events = autoSolve(context.data);
              context.setData({ ...context.data, events });
            }
          }}
        >
          <FaCalendarCheck />
        </button>
      </div>
    </div>
  );
};
