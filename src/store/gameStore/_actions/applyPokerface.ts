import type { Draft } from "immer";

import type { GameStoreState } from "../types";

export function applyPokerface(draft: Draft<GameStoreState>) {
  const currentSide = draft.currentTurn;
  const self = draft.players[currentSide];

  const itemIndex = self.items.findIndex((i) => i.id === "pokerFace");
  if (itemIndex < 0) return;

  self.items.splice(itemIndex, 1);
  self.pokerfaceActive = true;

  const actorName = currentSide === "player" ? "プレイヤー" : "CPU";
  draft.log.push(`${actorName}: ポーカーフェイス使用（次の呪いを無効化）`);
}
