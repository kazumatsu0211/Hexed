import type { Draft } from "immer";

import { getOpposingSide } from "../../../core/turns";
import type { GameStoreState } from "../types";

export function applyGag(draft: Draft<GameStoreState>) {
  const currentSide = draft.currentTurn;
  const opposingSide = getOpposingSide(currentSide);
  const self = draft.players[currentSide];

  const itemIndex = self.items.findIndex((i) => i.id === "gag");
  if (itemIndex < 0) return;

  self.items.splice(itemIndex, 1);
  draft.players[opposingSide].gaggedTurns += 1;

  const actorName = currentSide === "player" ? "プレイヤー" : "CPU";
  draft.log.push(`${actorName}: 猿轡使用（相手の次のアイテム使用を封じる）`);
}
