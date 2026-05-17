import { match } from "ts-pattern";

import { isSamePosition } from "./board";
import type {
  Board,
  Character,
  Item,
  ItemId,
  PeekedTile,
  Position,
  Tile,
} from "./types";

type TileClass = "good" | "neutral" | "unknown" | "bad";

export type CpuAction =
  | { type: "openTile"; position: Position }
  | { type: "useMonocle"; position: Position }
  | { type: "usePeephole" }
  | { type: "usePokerface" };

type CpuInput = {
  board: Board;
  peeked: PeekedTile[];
  character: Character;
  items: Item[];
  hp: number;
  pokerfaceActive: boolean;
  canUseItem: boolean;
};

const PRIORITY: TileClass[] = ["good", "neutral", "unknown", "bad"];

function hasItem(items: Item[], id: ItemId): boolean {
  return items.some((i) => i.id === id);
}

function isPeeked(peeked: PeekedTile[], position: Position): boolean {
  return peeked.some((p) => isSamePosition(p.position, position));
}

function isUnpeekedHiddenTile(tile: Tile, peeked: PeekedTile[]): boolean {
  return !tile.isRevealed && !isPeeked(peeked, tile.position);
}

function classifyTile(
  peekedAtTile: PeekedTile | undefined,
  character: Character,
): TileClass {
  if (!peekedAtTile) return "unknown";

  return match(peekedAtTile.effect)
    .returnType<TileClass>()
    .with("blessing", "treasure", "attack", () => "good")
    .with("empty", () => "neutral")
    .with("curse", () => (character.id === "swindler" ? "neutral" : "bad"))
    .exhaustive();
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function groupHiddenTilesByClass(
  board: Board,
  peeked: PeekedTile[],
  character: Character,
): Record<TileClass, Tile[]> {
  const groups: Record<TileClass, Tile[]> = {
    good: [],
    neutral: [],
    unknown: [],
    bad: [],
  };

  const hiddenTiles = board.flat().filter((tile) => !tile.isRevealed);
  for (const tile of hiddenTiles) {
    const peekedAtTile = peeked.find((p) =>
      isSamePosition(p.position, tile.position),
    );
    groups[classifyTile(peekedAtTile, character)].push(tile);
  }

  return groups;
}

function decideOpenTile(input: CpuInput): CpuAction {
  const groups = groupHiddenTilesByClass(
    input.board,
    input.peeked,
    input.character,
  );

  const populatedClass = PRIORITY.find((cls) => groups[cls].length > 0);
  if (!populatedClass) {
    throw new Error("decideCpuAction: 未開封マスが存在しません");
  }

  const picked = pickRandom(groups[populatedClass]);
  return { type: "openTile", position: picked.position };
}

function shouldUsePokerface(input: CpuInput): boolean {
  if (!hasItem(input.items, "pokerFace")) return false;
  if (input.pokerfaceActive) return false;
  if (input.character.id === "swindler") return false;
  if (input.hp > 2) return false;

  return input.board
    .flat()
    .some((tile) => !tile.isRevealed && tile.effect === "curse");
}

function shouldUsePeephole(input: CpuInput): boolean {
  if (!hasItem(input.items, "peephole")) return false;
  if (input.character.id === "swindler") return false;

  const unpeekedHiddenCurseExists = input.board
    .flat()
    .some(
      (tile) =>
        !tile.isRevealed &&
        tile.effect === "curse" &&
        !isPeeked(input.peeked, tile.position),
    );
  if (!unpeekedHiddenCurseExists) return false;

  return Math.random() < 0.5;
}

function decideMonocleTarget(input: CpuInput): Position | null {
  if (!hasItem(input.items, "monocle")) return null;
  if (Math.random() >= 0.4) return null;

  const unpeekedHiddenTiles = input.board
    .flat()
    .filter((tile) => isUnpeekedHiddenTile(tile, input.peeked));
  if (unpeekedHiddenTiles.length === 0) return null;

  return pickRandom(unpeekedHiddenTiles).position;
}

export function decideCpuAction(input: CpuInput): CpuAction {
  if (!input.canUseItem) return decideOpenTile(input);

  if (shouldUsePokerface(input)) return { type: "usePokerface" };
  if (shouldUsePeephole(input)) return { type: "usePeephole" };

  const monocleTarget = decideMonocleTarget(input);
  if (monocleTarget) return { type: "useMonocle", position: monocleTarget };

  return decideOpenTile(input);
}
