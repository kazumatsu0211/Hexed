import type { Item, ItemId } from "./types";

// items.ts
export const ITEMS: Record<ItemId, Item> = {
  monocle: { id: "monocle", name: "モノクル", description: "..." },
  peephole: { id: "peephole", name: "覗き穴", description: "..." },
  pokerFace: { id: "pokerFace", name: "ポーカーフェイス", description: "..." },
  cheatingSleeve: {
    id: "cheatingSleeve",
    name: "イカサマ袖",
    description: "...",
  },
  gag: { id: "gag", name: "猿轡", description: "..." },
};

export function getRandomItem(): Item {
  const ids = Object.keys(ITEMS) as ItemId[];
  return ITEMS[ids[Math.floor(Math.random() * ids.length)]];
}
