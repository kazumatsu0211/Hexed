import { type ReactNode, useCallback, useMemo, useState } from "react";

import type { ItemId } from "../../core/types";
import { type ItemSelection, SelectionContext } from "./context";

type SelectionProviderProps = {
  children: ReactNode;
};

export function SelectionProvider(props: SelectionProviderProps) {
  const { children } = props;

  const [selectedItem, setSelectedItem] = useState<ItemSelection | null>(null);

  const selectItem = useCallback((id: ItemId, index: number) => {
    setSelectedItem({ id, index });
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
