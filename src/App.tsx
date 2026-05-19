import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { match } from "ts-pattern";

import { BoardGrid } from "./components/BoardGrid/BoardGrid";
import { CharacterPanel } from "./components/CharacterPanel/CharacterPanel";
import { CharacterSelect } from "./components/CharacterSelect/CharacterSelect";
import { GameOverModal } from "./components/GameOverModal/GameOverModal";
import { ItemButton } from "./components/ItemButton/ItemButton";
import { Ornament } from "./components/Ornament/Ornament";
import { RulesDialog } from "./components/RulesDialog/RulesDialog";
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
  const phase = useGameStore((s) => s.phase);
  const openTile = useGameStore((s) => s.openTile);
  const initGame = useGameStore((s) => s.initGame);
  const goToSelect = useGameStore((s) => s.goToSelect);
  const applyPokerface = useGameStore((s) => s.applyPokerface);
  const applyGag = useGameStore((s) => s.applyGag);
  const applyMonocle = useGameStore((s) => s.applyMonocle);
  const applyPeephole = useGameStore((s) => s.applyPeephole);
  const applyCheatingSleeve = useGameStore((s) => s.applyCheatingSleeve);
  const applyFreeMonocle = useGameStore((s) => s.applyFreeMonocle);
  const runCpuTurn = useGameStore((s) => s.runCpuTurn);
  const log = useGameStore((s) => s.log);
  const logLength = log.length;

  const { selectedItem, selectItem, clearSelection } = useSelectionContext();

  const [cheatFirst, setCheatFirst] = useState<Position | null>(null);
  const [abilitySelected, setAbilitySelected] = useState(false);

  useEffect(() => {
    if (currentTurn !== "cpu") return;
    if (useGameStore.getState().winner !== "ongoing") return;

    const timer = setTimeout(() => runCpuTurn(), 1500);
    return () => clearTimeout(timer);
  }, [currentTurn, logLength, runCpuTurn]);

  const selfPlayer = players.player;
  const cpuPlayer = players.cpu;
  const isGagged = selfPlayer.gaggedTurns > 0;
  const isPlayerTurn = currentTurn === "player";
  const isCpuTurn = currentTurn === "cpu";
  const isGameOver = winner !== "ongoing";
  const canUseItems = isPlayerTurn && !isGagged && !isGameOver;
  const selectedItemId = selectedItem?.id ?? null;
  const requiresTarget =
    selectedItemId === "monocle" || selectedItemId === "cheatingSleeve";

  const showAbilityButton =
    selfPlayer.character.id === "connoisseur" && !selfPlayer.freeMonocleUsed;
  const canUseAbility = isPlayerTurn && !isGameOver;

  function findPeekedAt(position: Position) {
    return peekedSelf.find((p) => isSamePosition(p.position, position));
  }

  function handleSelectItem(id: ItemId, index: number) {
    setCheatFirst(null);
    setAbilitySelected(false);
    selectItem(id, index);
  }

  function handleSelectAbility() {
    setCheatFirst(null);
    clearSelection();
    setAbilitySelected(true);
  }

  function handleCancel() {
    setCheatFirst(null);
    setAbilitySelected(false);
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

  function handleAbilityClick(position: Position) {
    applyFreeMonocle(position);
    setAbilitySelected(false);
  }

  function handleTileClick(position: Position) {
    if (abilitySelected) {
      handleAbilityClick(position);
      return;
    }
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
      .with("monocle", () => {})
      .with("cheatingSleeve", () => {})
      .exhaustive();

    clearSelection();
  }

  const tilesDisabled =
    !isPlayerTurn ||
    isGameOver ||
    (selectedItemId !== null &&
      selectedItemId !== "monocle" &&
      selectedItemId !== "cheatingSleeve");

  const targetMessage = match({
    abilitySelected,
    selectedItemId,
    cheatFirst,
  })
    .with({ abilitySelected: true }, () => "無料モノクル：ターゲット選択")
    .with({ selectedItemId: "cheatingSleeve", cheatFirst: null }, () =>
      "1マス目を選択",
    )
    .with({ selectedItemId: "cheatingSleeve" }, () => "2マス目を選択")
    .otherwise(() => "ターゲット選択");

  const showActionPanel = selectedItem !== null || abilitySelected;
  const showUseButton = selectedItem !== null && !requiresTarget;
  const showTargetMessage = requiresTarget || abilitySelected;

  if (phase === "select") {
    return (
      <>
        <CharacterSelect onStart={initGame} />
        <RulesDialog />
      </>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-6 px-6 relative overflow-hidden bg-casino-radial-play">
      <div className="absolute inset-0 pointer-events-none bg-vignette" />

      <div className="relative z-10 flex flex-col items-center gap-4 w-full max-w-7xl">
        <div className="flex flex-col items-center w-80">
          <Ornament />
          <h1 className="my-1 font-title font-bold text-[3.2rem] tracking-[0.3em] uppercase text-accent-gold text-shadow-gold leading-none">
            HEXED
          </h1>
          <Ornament />
          <div className="flex items-center gap-2 mt-2 font-serif text-lg">
            <span className="text-accent-gold-dim tracking-wider">
              Turn {turnCount + 1} —
            </span>
            <span
              className={`w-3 h-3 rounded-full inline-block ${
                isPlayerTurn
                  ? "bg-accent-blessing shadow-[0_0_8px_#22c55e]"
                  : "bg-accent-blood shadow-[0_0_8px_#ef4444]"
              }`}
            />
            <span
              className={`tracking-wider ${
                isPlayerTurn ? "text-accent-blessing" : "text-accent-blood"
              }`}
            >
              {isPlayerTurn ? "Your turn" : "CPU turn"}
            </span>
          </div>
        </div>

        <div className="flex items-stretch justify-center gap-8 w-full">
          <CharacterPanel
            side="player"
            player={selfPlayer}
            isActive={isPlayerTurn}
          />

          <div className="flex flex-col items-center justify-between gap-3 w-[452px]">
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

            <div className="w-full flex flex-col items-center gap-3">
              <div className="w-full px-4 py-2 border border-accent-gold-dim/40 bg-bg-dark/60 rounded-[2px] text-center">
                <p className="font-jp text-sm text-accent-gold break-words">
                  ▸ {log[log.length - 1]}
                </p>
              </div>

              <div className="h-[44px] flex items-center">
                <AnimatePresence>
                  {showActionPanel && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center justify-center gap-3 whitespace-nowrap"
                    >
                      <span className="font-jp text-accent-gold text-base">
                        {showTargetMessage ? targetMessage : "使用ボタンで発動"}
                      </span>
                      {showUseButton && (
                        <button
                          type="button"
                          onClick={handleUseSelected}
                          className="font-title text-sm tracking-[0.2em] px-5 py-2 bg-transparent text-accent-gold border border-accent-gold rounded-[1px] hover:bg-accent-gold/10 transition-colors"
                        >
                          USE
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="font-title text-sm tracking-[0.2em] px-5 py-2 bg-transparent text-accent-gold-dim border border-accent-gold-dim rounded-[1px] hover:text-accent-gold hover:border-accent-gold transition-colors"
                      >
                        CANCEL
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col items-center gap-2 w-full">
                <p className="font-title text-xs tracking-[0.3em] uppercase text-accent-gold-dim">
                  — Items —
                </p>
                <div className="flex flex-wrap items-center gap-4 justify-center">
                  {showAbilityButton && (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={handleSelectAbility}
                        disabled={!canUseAbility}
                        title="目利き：試合中1回、無料でモノクル発動"
                        aria-label="無料モノクル"
                        className={`flex items-center justify-center w-[68px] h-[68px] rounded-full border-2 transition-all ${
                          abilitySelected
                            ? "bg-accent-curse/40 border-accent-curse text-accent-curse shadow-[0_0_16px_rgba(168,85,247,0.5)]"
                            : "bg-accent-curse/10 border-accent-curse text-accent-curse shadow-[0_0_16px_rgba(168,85,247,0.25)]"
                        } disabled:bg-transparent disabled:border-[#3a2a4a] disabled:text-[#5a4a6a] disabled:opacity-35 disabled:cursor-not-allowed disabled:shadow-none`}
                      >
                        <MagnifyingGlassIcon size={26} />
                      </button>
                      <span className="absolute -top-1.5 -right-1.5 px-1.5 rounded bg-accent-curse text-white text-[0.6rem] font-title tracking-wider leading-[16px]">
                        FREE
                      </span>
                    </div>
                  )}

                  <div className="flex gap-3">
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
                </div>
              </div>
            </div>
          </div>

          <CharacterPanel side="cpu" player={cpuPlayer} isActive={isCpuTurn} />
        </div>
      </div>

      <AnimatePresence>
        {isGameOver && (
          <GameOverModal winner={winner} onRestart={goToSelect} />
        )}
      </AnimatePresence>

      <RulesDialog />
    </div>
  );
}
