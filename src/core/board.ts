import type { Board, Position, Tile, TileEffect } from "./types";

export const BOARD_ROWS = 5;
export const BOARD_COLS = 5;

export const TILE_DISTRIBUTION: Record<TileEffect, number> = {
  attack: 8,
  curse: 5,
  blessing: 3,
  treasure: 4,
  empty: 5,
};

function buildEffectPool(): TileEffect[] {
  const effects: TileEffect[] = [];

  for (const effect of Object.keys(TILE_DISTRIBUTION) as TileEffect[]) {
    const count = TILE_DISTRIBUTION[effect];
    for (let i = 0; i < count; i++) {
      effects.push(effect);
    }
  }

  return effects;
}

function buildGrid(effects: TileEffect[]) {
  const board: Board = [];

  for (let row = 0; row < BOARD_ROWS; row++) {
    const tiles: Tile[] = [];

    for (let col = 0; col < BOARD_COLS; col++) {
      tiles.push({
        effect: effects[row * BOARD_COLS + col],
        position: { row, col },
        isRevealed: false,
      });
    }

    board.push(tiles);
  }

  return board;
}

function shuffle<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function createBoard(): Board {
  const effects: TileEffect[] = buildEffectPool();

  shuffle(effects);

  return buildGrid(effects);
}

export function countUnrevealedByEffect(
  board: Board,
): Record<TileEffect, number> {
  const counts: Record<TileEffect, number> = {
    attack: 0,
    curse: 0,
    blessing: 0,
    treasure: 0,
    empty: 0,
  };

  for (const tile of board.flat()) {
    if (!tile.isRevealed) counts[tile.effect] += 1;
  }

  return counts;
}

function isSamePosition(target: Position, current: Position) {
  return target.row === current.row && target.col === current.col;
}

export function revealTile(board: Board, target: Position): Board {
  return board.map((row) =>
    row.map((tile) =>
      isSamePosition(target, tile.position)
        ? { ...tile, isRevealed: true }
        : tile,
    ),
  );
}

export function getRow(board: Board, row: number): Tile[] {
  return board[row];
}

export function getColumn(board: Board, col: number): Tile[] {
  return board.map((row) => row[col]);
}
