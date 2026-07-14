import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { TooManyGamesProvider } from "./context/TooManyGamesProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooManyGamesProvider>
      <App />
    </TooManyGamesProvider>
  </StrictMode>,
);
