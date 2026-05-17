import { createBoard } from "../../../core/board";
import type { CharacterId } from "../../../core/types";
import type { GameStoreState } from "../types";
import { createInitialPlayer } from "./createInitialPlayer";

export function buildInitialState(
  playerCharId: CharacterId = "connoisseur",
  cpuCharId: CharacterId = "swindler",
): GameStoreState {
  return {
    board: createBoard(),
    players: {
      player: createInitialPlayer(playerCharId),
      cpu: createInitialPlayer(cpuCharId),
    },
    currentTurn: Math.random() < 0.5 ? "player" : "cpu",
    turnCount: 0,
    winner: "ongoing",
    log: ["ゲーム開始"],
    peeked: { player: [], cpu: [] },
    cpuActionsThisTurn: 0,
  };
}
