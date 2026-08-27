import type { View } from "../../../types";
import { NavButton } from "./NavButton";

const pages = [
  {
    label: "Attendees",
    name: "attendees",
  },
  {
    label: "Personalised Schedules",
    name: "schedules",
  },
  {
    label: "Event List",
    name: "event-list",
  },
  {
    label: "Event Grid",
    name: "event-grid",
  },
  {
    label: "Signup Sheets",
    name: "signup-sheets",
  },
] as const;

interface NavigationProps {
  changePage: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  currentView: View;
}

export const Navigation = ({ changePage, currentView }: NavigationProps) =>
  pages.map(({ name, label }) => (
    <NavButton key={name} value={name} changePage={changePage} currentView={currentView}>
      {label}
    </NavButton>
  ));
