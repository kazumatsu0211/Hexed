import { useState } from "react";

import { BoardGrid } from "./components/BoardGrid/BoardGrid";
import { HpBar } from "./components/HpBar/HpBar";
import { TileButton } from "./components/TileButton/TileButton";
import { createBoard, revealTile } from "./core/board";
import type { Board, Position } from "./core/types";

export function App() {
  const [board, setBoard] = useState<Board>(() => createBoard());

  function handleTileClick(position: Position) {
    setBoard((prev) => revealTile(prev, position));
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-6xl font-title text-accent-gold tracking-wider">
        HEXED
      </h1>
      <HpBar hp={5} maxHp={5} label="MAX" />
      <HpBar hp={0} maxHp={5} label="DEAD" />
      <HpBar hp={3} maxHp={5} label="MID" />
      <BoardGrid
        tileButtons={board.flat().map((tile) => (
          <TileButton
            key={`${tile.position.row}-${tile.position.col}`}
            tile={tile}
            onClick={() => handleTileClick(tile.position)}
          />
        ))}
      />
      <button
        onClick={() => setBoard(createBoard())}
        className="px-4 py-2 bg-accent-gold/20 hover:bg-accent-gold/30 rounded text-accent-gold transition-colors"
      >
        New Board
      </button>
    </div>
  );
}
