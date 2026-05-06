import {
  createBoard,
  countUnrevealedByEffect,
  TILE_DISTRIBUTION,
} from "./board";

describe("createBoard", () => {
  it("5×5の盤面を返す", () => {
    // Act
    const board = createBoard();

    // Assert
    expect(board).toHaveLength(5);
    expect(board[0]).toHaveLength(5);
  });

  it("TILE_DISTRIBUTION 通りの effect 分布を持つ", () => {
    // Act
    const board = createBoard();
    const counts = countUnrevealedByEffect(board);

    // Assert
    expect(counts).toEqual(TILE_DISTRIBUTION);
  });

  it("全マスが未開状態で初期化される", () => {
    // Act
    const board = createBoard();

    // Assert
    for (const row of board) {
      for (const tile of row) {
        expect(tile.isRevealed).toBe(false);
      }
    }
  });
});
