import { CHARACTERS } from "../../../core/characters";
import { getRandomItem } from "../../../core/items";
import type { CharacterId, PlayerState } from "../../../core/types";

export function createInitialPlayer(charId: CharacterId): PlayerState {
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
