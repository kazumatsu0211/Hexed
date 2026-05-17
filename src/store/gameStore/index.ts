import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { applyCheatingSleeve } from "./_actions/applyCheatingSleeve";
import { applyFreeMonocle } from "./_actions/applyFreeMonocle";
import { applyGag } from "./_actions/applyGag";
import { applyMonocle } from "./_actions/applyMonocle";
import { applyPeephole } from "./_actions/applyPeephole";
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

    applyMonocle: (position) => set((draft) => applyMonocle(draft, position)),

    applyPeephole: () => set(applyPeephole),

    applyCheatingSleeve: (a, b) => {
      set((draft) => applyCheatingSleeve(draft, a, b));
      if (get().winner === "ongoing") {
        get().endTurn();
      }
    },

    applyFreeMonocle: (position) =>
      set((draft) => applyFreeMonocle(draft, position)),
  })),
);
