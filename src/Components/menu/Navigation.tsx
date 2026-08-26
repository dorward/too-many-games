import type { View } from "../../types";

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

type NavigationProps = Pick<NavButtonProps, "currentView" | "changePage">;

export const Navigation = ({ changePage, currentView }: NavigationProps) =>
  pages.map(({ name, label }) => (
    <NavButton key={name} value={name} changePage={changePage} currentView={currentView}>
      {label}
    </NavButton>
  ));
