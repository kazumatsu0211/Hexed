import type { Draft } from "immer";

import type { Position } from "../../../core/types";
import type { GameStoreState } from "../types";

export function applyMonocle(draft: Draft<GameStoreState>, position: Position) {
  const currentSide = draft.currentTurn;
  const self = draft.players[currentSide];

  const itemIndex = self.items.findIndex((i) => i.id === "monocle");
  if (itemIndex < 0) return;

  const tile = draft.board[position.row][position.col];
  if (tile.isRevealed) return;

  self.items.splice(itemIndex, 1);
  draft.peeked[currentSide].push({
    position: tile.position,
    effect: tile.effect,
  });

  const actorName = currentSide === "player" ? "プレイヤー" : "CPU";
  draft.log.push(
    `${actorName}: モノクル使用（${position.row + 1}行${position.col + 1}列を覗いた）`,
  );
}
