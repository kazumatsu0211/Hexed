export type TileEffect = "attack" | "curse" | "blessing" | "treasure" | "empty";

export type Position = {
  row: number;
  col: number;
};

export type Tile = {
  effect: TileEffect;
  isRevealed: boolean;
  position: Position;
};

export type Board = Tile[][];

export type ItemId =
  | "monocle"
  | "peephole"
  | "pokerFace"
  | "cheatingSleeve"
  | "gag";

export type Item = {
  id: ItemId;
  name: string;
  description: string;
};

export type CharacterId = "gambler" | "swindler" | "connoisseur";

export type Character = {
  id: CharacterId;
  name: string;
  description: string;
};

export type TurnSide = "player" | "cpu";

export type PeekedTile = {
  position: Position;
  effect: TileEffect;
};

export type PlayerState = {
  hp: number;
  maxHp: number;
  items: Item[];
  character: Character;
  pokerfaceActive: boolean;
  gaggedTurns: number;
  freeMonocleUsed: boolean;
};

export type GameState = {
  board: Board;
  players: Record<TurnSide, PlayerState>;
  currentTurn: TurnSide;
  turnCount: number;
  winner: TurnSide | "draw" | "ongoing";
  log: string[];
  peeked: Record<TurnSide, PeekedTile[]>;
};
