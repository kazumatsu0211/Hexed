import { useContext } from "react";

import { SelectionContext } from "./context";

export function useSelectionContext() {
  const context = useContext(SelectionContext);

  if (!context) {
    throw new Error("useSelection must be used inside SelectionProvider");
  }

  return context;
}
