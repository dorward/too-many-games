import { UploadData } from "./Components/UploadData/UploadData";
import { Dashboard } from "./Components/Dashboard/Dashboard";
import { useTooManyGamesData } from "./context/useTooManyGamesData";

export const App = () => {
  const context = useTooManyGamesData();
  if (context.data) {
    return <Dashboard />;
  }

  return <UploadData />;
};
