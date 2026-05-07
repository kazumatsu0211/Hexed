import {
  countUnrevealedByEffect,
  createBoard,
  revealTile,
  TILE_DISTRIBUTION,
} from "./board";

describe("board", () => {
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

  describe("revealTile", () => {
    it("指定した位置のタイルを開く", () => {
      // Arrange
      const board = createBoard();
      const target = { row: 2, col: 3 };

      // Act
      const newBoard = revealTile(board, target);

      // Assert
      expect(newBoard[target.row][target.col].isRevealed).toBe(true);
    });
  });
});
