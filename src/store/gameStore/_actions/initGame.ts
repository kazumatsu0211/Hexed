import type { Draft } from "immer";

import type { CharacterId } from "../../../core/types";
import { buildInitialState } from "../_factories/buildInitialState";
import type { GameStoreState } from "../types";

export function initGame(
  draft: Draft<GameStoreState>,
  playerCharId: CharacterId = "gambler",
  cpuCharId: CharacterId = "swindler",
) {
  Object.assign(draft, buildInitialState(playerCharId, cpuCharId));
}
