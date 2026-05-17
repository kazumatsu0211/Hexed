import type { Draft } from "immer";

import { getOpposingSide } from "../../../core/turns";
import type { GameStoreState } from "../types";

export function endTurn(draft: Draft<GameStoreState>) {
  draft.currentTurn = getOpposingSide(draft.currentTurn);
  draft.turnCount += 1;
  draft.cpuActionsThisTurn = 0;
}
