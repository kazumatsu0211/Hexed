import type { Draft } from "immer";

import type { Position } from "../../../core/types";
import type { GameStoreState } from "../types";

function isSamePosition(a: Position, b: Position) {
  return a.row === b.row && a.col === b.col;
}

export function applyPeephole(draft: Draft<GameStoreState>) {
  const currentSide = draft.currentTurn;
  const self = draft.players[currentSide];

  const itemIndex = self.items.findIndex((i) => i.id === "peephole");
  if (itemIndex < 0) return;

  self.items.splice(itemIndex, 1);

  const alreadyPeeked = draft.peeked[currentSide];
  const candidates = draft.board.flat().filter(
    (tile) =>
      !tile.isRevealed &&
      tile.effect === "curse" &&
      !alreadyPeeked.some((p) => isSamePosition(p.position, tile.position)),
  );

  const actorName = currentSide === "player" ? "プレイヤー" : "CPU";

  if (candidates.length === 0) {
    draft.log.push(`${actorName}: 覗き穴使用（効果なし）`);
    return;
  }

  const pickedIdx = Math.floor(Math.random() * candidates.length);
  const picked = candidates[pickedIdx];

  draft.peeked[currentSide].push({
    position: picked.position,
    effect: picked.effect,
  });

  draft.log.push(
    `${actorName}: 覗き穴使用（${picked.position.row + 1}行${picked.position.col + 1}列の呪いを露出）`,
  );
}
