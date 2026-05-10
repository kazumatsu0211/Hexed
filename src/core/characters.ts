import type { Character, CharacterId } from "./types";

// characters.ts
export const CHARACTERS: Record<CharacterId, Character> = {
  gambler: { id: "gambler", name: "博徒", description: "初期アイテム +1" },
  swindler: {
    id: "swindler",
    name: "ペテン師",
    description: "呪いマスのダメージ -1",
  },
  connoisseur: {
    id: "connoisseur",
    name: "目利き",
    description: "試合中1回、無料でモノクル発動",
  },
};
