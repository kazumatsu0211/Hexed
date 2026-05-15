import type { Draft } from "immer";

import { isSamePosition } from "../../../core/board";
import type { Position, TurnSide } from "../../../core/types";
import type { GameStoreState } from "../types";

export function applyCheatingSleeve(
  draft: Draft<GameStoreState>,
  a: Position,
  b: Position,
) {
  const currentSide = draft.currentTurn;
  const self = draft.players[currentSide];

  const itemIndex = self.items.findIndex((i) => i.id === "cheatingSleeve");
  if (itemIndex < 0) return;

  const tileA = draft.board[a.row][a.col];
  const tileB = draft.board[b.row][b.col];
  if (tileA.isRevealed || tileB.isRevealed) return;
  if (isSamePosition(a, b)) return;

  self.items.splice(itemIndex, 1);

  const tmp = tileA.effect;
  tileA.effect = tileB.effect;
  tileB.effect = tmp;

  const sides: TurnSide[] = ["player", "cpu"];
  for (const side of sides) {
    draft.peeked[side] = draft.peeked[side].filter(
      (p) => !isSamePosition(p.position, a) && !isSamePosition(p.position, b),
    );
  }

  const actorName = currentSide === "player" ? "プレイヤー" : "CPU";
  draft.log.push(
    `${actorName}: イカサマ袖使用（${a.row + 1}行${a.col + 1}列 ↔ ${b.row + 1}行${b.col + 1}列）`,
  );
}
