import type { Draft } from "immer";

import type { Position } from "../../../core/types";
import type { GameStoreState } from "../types";

export function applyFreeMonocle(
  draft: Draft<GameStoreState>,
  position: Position,
) {
  const currentSide = draft.currentTurn;
  const self = draft.players[currentSide];

  if (self.character.id !== "connoisseur") return;
  if (self.freeMonocleUsed) return;

  const tile = draft.board[position.row][position.col];
  if (tile.isRevealed) return;

  self.freeMonocleUsed = true;
  draft.peeked[currentSide].push({
    position: tile.position,
    effect: tile.effect,
  });

  const actorName = currentSide === "player" ? "プレイヤー" : "CPU";
  draft.log.push(
    `${actorName}: 目利き能力（${position.row + 1}行${position.col + 1}列を覗いた）`,
  );
}
