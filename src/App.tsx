import { useEffect, useState } from "react";
import { match } from "ts-pattern";

import { BoardGrid } from "./components/BoardGrid/BoardGrid";
import { GameOverModal } from "./components/GameOverModal/GameOverModal";
import { HpBar } from "./components/HpBar/HpBar";
import { ItemButton } from "./components/ItemButton/ItemButton";
import { TileButton } from "./components/TileButton/TileButton";
import { useSelectionContext } from "./contexts/SelectionContext/useSelectionContext";
import { isSamePosition } from "./core/board";
import type { ItemId, Position } from "./core/types";
import { useGameStore } from "./store/gameStore";

export function App() {
  const board = useGameStore((s) => s.board);
  const players = useGameStore((s) => s.players);
  const currentTurn = useGameStore((s) => s.currentTurn);
  const turnCount = useGameStore((s) => s.turnCount);
  const winner = useGameStore((s) => s.winner);
  const peekedSelf = useGameStore((s) => s.peeked.player);
  const openTile = useGameStore((s) => s.openTile);
  const reset = useGameStore((s) => s.reset);
  const applyPokerface = useGameStore((s) => s.applyPokerface);
  const applyGag = useGameStore((s) => s.applyGag);
  const applyMonocle = useGameStore((s) => s.applyMonocle);
  const applyPeephole = useGameStore((s) => s.applyPeephole);
  const applyCheatingSleeve = useGameStore((s) => s.applyCheatingSleeve);
  const endTurn = useGameStore((s) => s.endTurn);

  const { selectedItem, selectItem, clearSelection } = useSelectionContext();

  const [cheatFirst, setCheatFirst] = useState<Position | null>(null);

  // TODO Phase 7: CPU AI を実装したらこのスキャフォルドを置き換える
  useEffect(() => {
    if (currentTurn !== "cpu") return;
    if (useGameStore.getState().winner !== "ongoing") return;

    const timer = setTimeout(() => endTurn(), 500);
    return () => clearTimeout(timer);
  }, [currentTurn, endTurn]);

  const selfPlayer = players.player;
  const isGagged = selfPlayer.gaggedTurns > 0;
  const isPlayerTurn = currentTurn === "player";
  const canUseItems = isPlayerTurn && !isGagged && winner === "ongoing";
  const selectedItemId = selectedItem?.id ?? null;
  const requiresTarget =
    selectedItemId === "monocle" || selectedItemId === "cheatingSleeve";

  function findPeekedAt(position: Position) {
    return peekedSelf.find((p) => isSamePosition(p.position, position));
  }

  function handleSelectItem(id: ItemId, index: number) {
    setCheatFirst(null);
    selectItem(id, index);
  }

  function handleCancel() {
    setCheatFirst(null);
    clearSelection();
  }

  function handleMonocleClick(position: Position) {
    applyMonocle(position);
    clearSelection();
  }

  function handleCheatingSleeveClick(position: Position) {
    if (cheatFirst === null) {
      setCheatFirst(position);
      return;
    }
    if (isSamePosition(cheatFirst, position)) {
      setCheatFirst(null);
      return;
    }
    applyCheatingSleeve(cheatFirst, position);
    setCheatFirst(null);
    clearSelection();
  }

  function handleTileClick(position: Position) {
    match(selectedItemId)
      .with(null, () => openTile(position))
      .with("monocle", () => handleMonocleClick(position))
      .with("cheatingSleeve", () => handleCheatingSleeveClick(position))
      .with("pokerFace", "gag", "peephole", () => {})
      .exhaustive();
  }

  function handleUseSelected() {
    if (!selectedItemId) return;

    match(selectedItemId)
      .with("pokerFace", () => applyPokerface())
      .with("gag", () => applyGag())
      .with("peephole", () => applyPeephole())
      .with("monocle", () => {}) // ターゲット選択型なのでここでは何もしない
      .with("cheatingSleeve", () => {}) // ターゲット選択型なのでここでは何もしない
      .exhaustive();

    clearSelection();
  }

  const tilesDisabled =
    !isPlayerTurn ||
    winner !== "ongoing" ||
    (selectedItemId !== null &&
      selectedItemId !== "monocle" &&
      selectedItemId !== "cheatingSleeve");

  const targetMessage = match({ selectedItemId, cheatFirst })
    .with({ selectedItemId: "cheatingSleeve", cheatFirst: null }, () =>
      "1マス目を選択してください",
    )
    .with({ selectedItemId: "cheatingSleeve" }, () =>
      "2マス目を選択してください",
    )
    .otherwise(() => "ターゲットを選択してください");

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
            peeked={findPeekedAt(tile.position)}
            onClick={() => handleTileClick(tile.position)}
            disabled={tilesDisabled}
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
            onClick={() => handleSelectItem(item.id, i)}
            selected={selectedItem?.index === i}
            disabled={!canUseItems}
          />
        ))}
      </div>

      {selectedItem && (
        <div className="flex gap-3 items-center">
          <span className="text-accent-gold-dim">
            {requiresTarget ? targetMessage : "使用ボタンで発動"}
          </span>
          {!requiresTarget && (
            <button
              onClick={handleUseSelected}
              className="px-4 py-2 bg-accent-gold text-bg-dark rounded font-bold hover:bg-accent-gold/80 transition-colors"
            >
              使用
            </button>
          )}
          <button
            onClick={handleCancel}
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
