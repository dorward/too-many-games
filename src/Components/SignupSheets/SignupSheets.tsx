import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import { eventHasParticipant } from "../../util/eventHasParticipant";
import { SignupSheet } from "./SignupSheet/SignupSheet";
import "./signupSheets.css";

interface SignupSheetsProps {
  participantFilter: string;
}

export const SignupSheets = ({ participantFilter }: SignupSheetsProps) => {
  const { data } = useTooManyGamesData();
  const events =
    participantFilter === ""
      ? data?.events
      : data?.events.filter((event) => eventHasParticipant(event, participantFilter));

  return (
    <main className="signup-sheets">
      {events?.map((event) => <SignupSheet event={event} key={event.id} />)}
    </main>
  );
};
