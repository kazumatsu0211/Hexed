import { createContext } from "react";

import type { ItemId } from "../../core/types";

export type ItemSelection = {
  id: ItemId;
  index: number;
};

export type SelectionContextValue = {
  selectedItem: ItemSelection | null;
  selectItem: (id: ItemId, index: number) => void;
  clearSelection: () => void;
};

export const SelectionContext = createContext<SelectionContextValue | null>(
  null,
);
