import type {
  Board,
  CharacterId,
  PeekedTile,
  PlayerState,
  Position,
  TurnSide,
} from "../../core/types";

export type GameStoreState = {
  board: Board;
  players: Record<TurnSide, PlayerState>;
  currentTurn: TurnSide;
  turnCount: number;
  winner: TurnSide | "draw" | "ongoing";
  log: string[];
  peeked: Record<TurnSide, PeekedTile[]>;
};

export type GameStoreActions = {
  initGame: (playerCharId?: CharacterId, cpuCharId?: CharacterId) => void;
  openTile: (position: Position) => void;
  endTurn: () => void;
  reset: () => void;
  applyPokerface: () => void;
  applyGag: () => void;
  applyMonocle: (position: Position) => void;
  applyPeephole: () => void;
};

export type GameStore = GameStoreState & GameStoreActions;
