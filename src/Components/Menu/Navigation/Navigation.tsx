import type { View } from "../../../types";
import { NavButton } from "./NavButton";

interface NavigationItem {
  label: string;
  name: View;
}

interface NavigationProps {
  changePage: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  currentView: View;
}

const people: readonly NavigationItem[] = [
  {
    label: "Attendees",
    name: "attendees",
  },
  {
    label: "Room Map",
    name: "room-map",
  },
  {
    label: "Personalised Schedules",
    name: "schedules",
  },
];

const games: readonly NavigationItem[] = [
  {
    label: "Games",
    name: "event-list",
  },
  {
    label: "Game Calendar",
    name: "event-grid",
  },
  {
    label: "Signup Sheets",
    name: "signup-sheets",
  },
];

const generateButtons = (
  items: readonly NavigationItem[],
  { changePage, currentView }: NavigationProps,
): React.ReactNode =>
  items.map(({ name, label }: NavigationItem) => (
    <NavButton key={name} value={name} changePage={changePage} currentView={currentView}>
      {label}
    </NavButton>
  ));

export const Navigation = (props: NavigationProps) => (
  <div>
    <div className="button-group">{generateButtons(people, props)}</div>
    <div className="button-group">{generateButtons(games, props)}</div>
  </div>
);
