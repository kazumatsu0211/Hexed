import type { TurnSide } from "./types";

export function getOpposingSide(side: TurnSide): TurnSide {
  return side === "player" ? "cpu" : "player";
}
