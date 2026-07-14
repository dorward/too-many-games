import { UploadData } from "./Components/uploadData/UploadData";
import { Viewer } from "./Components/viewer/Viewer";
import { useTooManyGamesData } from "./context/useTooManyGamesData";

export const App = () => {
  const context = useTooManyGamesData();
  if (context.data) {
    return <Viewer />;
  }

  return <UploadData />;
};
