import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App.tsx";
import { SelectionProvider } from "./contexts/SelectionContext/SelectionProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SelectionProvider>
      <App />
    </SelectionProvider>
  </StrictMode>,
);
