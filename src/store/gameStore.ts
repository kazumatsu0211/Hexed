import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { createBoard, revealTile } from "../core/board";
import { CHARACTERS } from "../core/characters";
import { calculateTileEffect, checkWinner, clampHp } from "../core/gameRules";
import { getRandomItem } from "../core/items";
import { getOpposingSide } from "../core/turns";
import type {
  Board,
  CharacterId,
  PeekedTile,
  PlayerState,
  Position,
  TurnSide,
} from "../core/types";

type GameStoreState = {
  board: Board;
  players: Record<TurnSide, PlayerState>;
  currentTurn: TurnSide;
  turnCount: number;
  winner: TurnSide | "draw" | "ongoing";
  log: string[];
  peeked: Record<TurnSide, PeekedTile[]>;
};

type GameStoreActions = {
  initGame: (playerCharId?: CharacterId, cpuCharId?: CharacterId) => void;
  openTile: (position: Position) => void;
  endTurn: () => void;
  reset: () => void;
};

type GameStore = GameStoreState & GameStoreActions;

function createInitialPlayer(charId: CharacterId) {
  const character = CHARACTERS[charId];
  const initialItemCount = character.id === "gambler" ? 4 : 3;

  return {
    hp: 3,
    maxHp: 5,
    items: Array.from({ length: initialItemCount }, () => getRandomItem()),
    character,
    pokerfaceActive: false,
    gaggedTurns: 0,
    freeMonocleUsed: false,
  };
}

function buildInitialState(
  playerCharId: CharacterId = "gambler",
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
  };
}

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    ...buildInitialState(),

    initGame: (playerCharId = "gambler", cpuCharId = "swindler") => {
      set((state) => {
        Object.assign(state, buildInitialState(playerCharId, cpuCharId));
      });
    },
    openTile: (position) => {
      const state = get();

      if (state.winner !== "ongoing") return;

      const tile = state.board[position.row][position.col];
      if (tile.isRevealed) return;

      const currentSide = state.currentTurn;
      const opposingSide = getOpposingSide(currentSide);
      const self = state.players[currentSide];
      const effect = calculateTileEffect(tile.effect, self);

      set((draft) => {
        draft.board = revealTile(draft.board, position);

        draft.players[currentSide].hp = clampHp(
          draft.players[currentSide].hp + effect.selfHpDelta,
          draft.players[currentSide].maxHp,
        );
        draft.players[opposingSide].hp = clampHp(
          draft.players[opposingSide].hp + effect.opponentHpDelta,
          draft.players[opposingSide].maxHp,
        );

        if (effect.selfGetsItem) {
          draft.players[currentSide].items.push(getRandomItem());
        }

        if (tile.effect === "curse") {
          draft.players[currentSide].pokerfaceActive = false;
        }

        const actorName = currentSide === "player" ? "プレイヤー" : "CPU";
        draft.log.push(`${actorName}: ${effect.description}`);

        draft.winner = checkWinner(draft.players.player, draft.players.cpu);
      });

      if (get().winner === "ongoing") {
        get().endTurn();
      }
    },
    endTurn: () => {
      set((state) => {
        state.currentTurn = getOpposingSide(state.currentTurn);
        state.turnCount += 1;
      });
    },
    reset: () => get().initGame(),
  })),
);
