import { type ReactNode, useCallback, useMemo, useState } from "react";

import type { ItemId } from "../../core/types";
import { SelectionContext } from "./context";

type SelectionProviderProps = {
  children: ReactNode;
};

export function SelectionProvider(props: SelectionProviderProps) {
  const { children } = props;

  const [selectedItem, setSelectedItem] = useState<ItemId | null>(null);

  const selectItem = useCallback((id: ItemId) => {
    setSelectedItem(id);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const value = useMemo(
    () => ({ selectedItem, selectItem, clearSelection }),
    [selectedItem, selectItem, clearSelection],
  );

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}
