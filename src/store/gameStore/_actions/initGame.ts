import type { Draft } from "immer";

import type { CharacterId } from "../../../core/types";
import { buildInitialState } from "../_factories/buildInitialState";
import type { GameStoreState } from "../types";

export function initGame(
  draft: Draft<GameStoreState>,
  playerCharId: CharacterId = "connoisseur",
  cpuCharId: CharacterId = "swindler",
) {
  Object.assign(draft, buildInitialState(playerCharId, cpuCharId));
  draft.phase = "playing";
}
