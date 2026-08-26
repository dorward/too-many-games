import { UploadData } from "./Components/UploadData/UploadData";
import { Viewer } from "./Components/Viewer/Viewer";
import { useTooManyGamesData } from "./context/useTooManyGamesData";

export const App = () => {
  const context = useTooManyGamesData();
  if (context.data) {
    return <Viewer />;
  }

  return <UploadData />;
};
