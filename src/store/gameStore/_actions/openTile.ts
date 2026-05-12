import type { Draft } from "immer";

import { revealTile } from "../../../core/board";
import {
  calculateTileEffect,
  checkWinner,
  clampHp,
} from "../../../core/gameRules";
import { getRandomItem } from "../../../core/items";
import { getOpposingSide } from "../../../core/turns";
import type { Position } from "../../../core/types";
import type { GameStoreState } from "../types";

export function openTile(draft: Draft<GameStoreState>, position: Position) {
  if (draft.winner !== "ongoing") return;

  const tile = draft.board[position.row][position.col];
  if (tile.isRevealed) return;

  const currentSide = draft.currentTurn;
  const opposingSide = getOpposingSide(currentSide);
  const self = draft.players[currentSide];
  const effect = calculateTileEffect(tile.effect, self);

  draft.board = revealTile(draft.board, position);

  draft.players[currentSide].hp = clampHp(
    draft.players[currentSide].hp + effect.selfHpDelta,
    draft.players[currentSide].maxHp,
  );
  draft.players[opposingSide].hp = clampHp(
    draft.players[opposingSide].hp + effect.opponentHpDelta,
    draft.players[opposingSide].maxHp,
  );

  if (effect.selfGetsItem) {
    draft.players[currentSide].items.push(getRandomItem());
  }

  if (tile.effect === "curse") {
    draft.players[currentSide].pokerfaceActive = false;
  }

  const actorName = currentSide === "player" ? "プレイヤー" : "CPU";
  draft.log.push(`${actorName}: ${effect.description}`);

  draft.winner = checkWinner(draft.players.player, draft.players.cpu);
}
