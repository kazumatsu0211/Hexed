import type { PeekedTile, Tile } from "../../../core/types";

export function getVisualState(tile: Tile, peeked?: PeekedTile) {
  if (tile.isRevealed) return "revealed";
  if (peeked) return "peeked";
  return "hidden";
}
