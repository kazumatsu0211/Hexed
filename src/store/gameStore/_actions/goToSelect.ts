import type { Draft } from "immer";

import { buildInitialState } from "../_factories/buildInitialState";
import type { GameStoreState } from "../types";

export function goToSelect(draft: Draft<GameStoreState>) {
  Object.assign(draft, buildInitialState());
}
