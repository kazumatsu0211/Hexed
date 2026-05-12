import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { applyGag } from "./_actions/applyGag";
import { applyPokerface } from "./_actions/applyPokerface";
import { endTurn } from "./_actions/endTurn";
import { initGame } from "./_actions/initGame";
import { openTile } from "./_actions/openTile";
import { buildInitialState } from "./_factories/buildInitialState";
import type { GameStore } from "./types";

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    ...buildInitialState(),

    initGame: (playerCharId, cpuCharId) =>
      set((draft) => initGame(draft, playerCharId, cpuCharId)),

    openTile: (position) => {
      set((draft) => openTile(draft, position));
      if (get().winner === "ongoing") {
        get().endTurn();
      }
    },

    endTurn: () => set(endTurn),

    reset: () => get().initGame(),

    applyPokerface: () => set(applyPokerface),

    applyGag: () => set(applyGag),
  })),
);
