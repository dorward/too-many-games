import type { View } from "../../../types";

interface NavButtonProps extends React.PropsWithChildren {
  changePage: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  currentView: View;
  value: View;
}

export const NavButton = ({ value, children, changePage, currentView }: NavButtonProps) => (
  <button
    onClick={changePage}
    value={value}
    className={currentView === value ? "selected" : ""}
  >
    {children}
  </button>
);
