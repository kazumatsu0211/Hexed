import { match } from "ts-pattern";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { decideCpuAction } from "../../core/cpuAi";
import { applyCheatingSleeve } from "./_actions/applyCheatingSleeve";
import { applyFreeMonocle } from "./_actions/applyFreeMonocle";
import { applyGag } from "./_actions/applyGag";
import { applyMonocle } from "./_actions/applyMonocle";
import { applyPeephole } from "./_actions/applyPeephole";
import { applyPokerface } from "./_actions/applyPokerface";
import { endTurn } from "./_actions/endTurn";
import { goToSelect } from "./_actions/goToSelect";
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

    goToSelect: () => set(goToSelect),

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

    runCpuTurn: () => {
      const state = get();
      if (state.currentTurn !== "cpu") return;
      if (state.winner !== "ongoing") return;

      const cpu = state.players.cpu;
      const action = decideCpuAction({
        board: state.board,
        peeked: state.peeked.cpu,
        character: cpu.character,
        items: cpu.items,
        hp: cpu.hp,
        pokerfaceActive: cpu.pokerfaceActive,
        canUseItem: state.cpuActionsThisTurn === 0,
      });

      match(action)
        .with({ type: "openTile" }, (a) => state.openTile(a.position))
        .with({ type: "useMonocle" }, (a) => {
          state.applyMonocle(a.position);
          set((draft) => {
            draft.cpuActionsThisTurn += 1;
          });
        })
        .with({ type: "usePeephole" }, () => {
          state.applyPeephole();
          set((draft) => {
            draft.cpuActionsThisTurn += 1;
          });
        })
        .with({ type: "usePokerface" }, () => {
          state.applyPokerface();
          set((draft) => {
            draft.cpuActionsThisTurn += 1;
          });
        })
        .exhaustive();
    },
  })),
);
