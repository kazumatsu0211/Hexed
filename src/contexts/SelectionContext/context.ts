import { createContext } from "react";

import type { ItemId } from "../../core/types";

export type SelectionContextValue = {
  selectedItem: ItemId | null;
  selectItem: (id: ItemId) => void;
  clearSelection: () => void;
};

export const SelectionContext = createContext<SelectionContextValue | null>(
  null,
);
