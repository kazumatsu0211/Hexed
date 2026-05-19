import type {
  Board,
  CharacterId,
  PeekedTile,
  PlayerState,
  Position,
  TurnSide,
} from "../../core/types";

export type GamePhase = "select" | "playing";

export type GameStoreState = {
  phase: GamePhase;
  board: Board;
  players: Record<TurnSide, PlayerState>;
  currentTurn: TurnSide;
  turnCount: number;
  winner: TurnSide | "draw" | "ongoing";
  log: string[];
  peeked: Record<TurnSide, PeekedTile[]>;
  cpuActionsThisTurn: number;
};

export type GameStoreActions = {
  initGame: (playerCharId?: CharacterId, cpuCharId?: CharacterId) => void;
  openTile: (position: Position) => void;
  endTurn: () => void;
  goToSelect: () => void;
  applyPokerface: () => void;
  applyGag: () => void;
  applyMonocle: (position: Position) => void;
  applyPeephole: () => void;
  applyCheatingSleeve: (a: Position, b: Position) => void;
  applyFreeMonocle: (position: Position) => void;
  runCpuTurn: () => void;
};

export type GameStore = GameStoreState & GameStoreActions;
