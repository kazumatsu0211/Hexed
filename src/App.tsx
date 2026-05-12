import { match } from "ts-pattern";

import { BoardGrid } from "./components/BoardGrid/BoardGrid";
import { GameOverModal } from "./components/GameOverModal/GameOverModal";
import { HpBar } from "./components/HpBar/HpBar";
import { ItemButton } from "./components/ItemButton/ItemButton";
import { TileButton } from "./components/TileButton/TileButton";
import { useSelectionContext } from "./contexts/SelectionContext/useSelectionContext";
import { useGameStore } from "./store/gameStore";

export function App() {
  const board = useGameStore((s) => s.board);
  const players = useGameStore((s) => s.players);
  const currentTurn = useGameStore((s) => s.currentTurn);
  const turnCount = useGameStore((s) => s.turnCount);
  const winner = useGameStore((s) => s.winner);
  const openTile = useGameStore((s) => s.openTile);
  const reset = useGameStore((s) => s.reset);
  const applyPokerface = useGameStore((s) => s.applyPokerface);
  const applyGag = useGameStore((s) => s.applyGag);

  const { selectedItem, selectItem, clearSelection } = useSelectionContext();

  const selfPlayer = players.player;
  const isGagged = selfPlayer.gaggedTurns > 0;
  const isPlayerTurn = currentTurn === "player";
  const canUseItems = isPlayerTurn && !isGagged && winner === "ongoing";

  function handleUseSelected() {
    if (!selectedItem) return;

    match(selectedItem)
      .with("pokerFace", () => applyPokerface())
      .with("gag", () => applyGag())
      .with("monocle", () => {}) // Phase 5 中盤で実装
      .with("peephole", () => {}) // Phase 5 中盤で実装
      .with("cheatingSleeve", () => {}) // Phase 5 後半で実装
      .exhaustive();

    clearSelection();
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-8 gap-4">
      <h1 className="text-6xl font-title text-accent-gold tracking-wider">
        HEXED
      </h1>

      <p className="text-accent-gold/60">
        Turn {turnCount + 1} — {isPlayerTurn ? "🟢 Your turn" : "🔴 CPU turn"}
      </p>

      <HpBar
        hp={players.cpu.hp}
        maxHp={players.cpu.maxHp}
        label={`CPU (${players.cpu.character.name})`}
      />

      <BoardGrid
        tileButtons={board.flat().map((tile) => (
          <TileButton
            key={`${tile.position.row}-${tile.position.col}`}
            tile={tile}
            onClick={() => openTile(tile.position)}
            disabled={
              !isPlayerTurn || winner !== "ongoing" || selectedItem !== null
            }
          />
        ))}
      />

      <HpBar
        hp={selfPlayer.hp}
        maxHp={selfPlayer.maxHp}
        label={`YOU (${selfPlayer.character.name})`}
      />

      <div className="flex gap-2">
        {selfPlayer.items.map((item, i) => (
          <ItemButton
            key={`${item.id}-${i}`}
            item={item}
            onClick={() => selectItem(item.id)}
            selected={selectedItem === item.id}
            disabled={!canUseItems}
          />
        ))}
      </div>

      {selectedItem && (
        <div className="flex gap-3 items-center">
          <span className="text-accent-gold-dim">
            {selectedItem === "pokerFace" || selectedItem === "gag"
              ? "使用ボタンで発動"
              : "ターゲットを選択してください"}
          </span>
          <button
            onClick={handleUseSelected}
            className="px-4 py-2 bg-accent-gold text-bg-dark rounded font-bold hover:bg-accent-gold/80 transition-colors"
          >
            使用
          </button>
          <button
            onClick={clearSelection}
            className="px-4 py-2 border-2 border-accent-gold-dim text-accent-gold rounded hover:border-accent-gold transition-colors"
          >
            キャンセル
          </button>
        </div>
      )}

      {isGagged && (
        <p className="text-accent-curse text-sm">
          猿轡中：アイテム使用不可（残り {selfPlayer.gaggedTurns} ターン）
        </p>
      )}

      {winner !== "ongoing" && (
        <GameOverModal winner={winner} onRestart={reset} />
      )}
    </div>
  );
}
