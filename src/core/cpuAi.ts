import { match } from "ts-pattern";

import type {
  Board,
  Character,
  PeekedTile,
  Position,
  Tile,
} from "./types";

type TileClass = "good" | "neutral" | "unknown" | "bad";

export type CpuAction = {
  type: "openTile";
  position: Position;
};

type CpuInput = {
  board: Board;
  peeked: PeekedTile[];
  character: Character;
};

function findPeekedAt(
  peeked: PeekedTile[],
  position: Position,
): PeekedTile | undefined {
  return peeked.find(
    (p) => p.position.row === position.row && p.position.col === position.col,
  );
}

function classify(
  peeked: PeekedTile | undefined,
  character: Character,
): TileClass {
  if (!peeked) return "unknown";

  return match(peeked.effect)
    .returnType<TileClass>()
    .with("blessing", "treasure", "attack", () => "good")
    .with("empty", () => "neutral")
    .with("curse", () => (character.id === "swindler" ? "neutral" : "bad"))
    .exhaustive();
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

const PRIORITY: TileClass[] = ["good", "neutral", "unknown", "bad"];

export function decideCpuAction(input: CpuInput): CpuAction {
  const { board, peeked, character } = input;

  const groups: Record<TileClass, Tile[]> = {
    good: [],
    neutral: [],
    unknown: [],
    bad: [],
  };

  for (const tile of board.flat()) {
    if (tile.isRevealed) continue;
    const cls = classify(findPeekedAt(peeked, tile.position), character);
    groups[cls].push(tile);
  }

  for (const cls of PRIORITY) {
    if (groups[cls].length > 0) {
      const picked = pickRandom(groups[cls]);
      return { type: "openTile", position: picked.position };
    }
  }

  throw new Error("decideCpuAction: 未開封マスが存在しません");
}
