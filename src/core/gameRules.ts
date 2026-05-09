import { match, P } from "ts-pattern";

import type { PlayerState, TileEffect, TurnSide } from "./types";

export type TileEffectResult = {
  selfHpDelta: number;
  opponentHpDelta: number;
  selfGetsItem: boolean;
  description: string;
};

export function calculateTileEffect(
  tileEffect: TileEffect,
  self: PlayerState,
): TileEffectResult {
  return match({ tileEffect, self })
    .with({ tileEffect: "attack" }, () => ({
      selfHpDelta: 0,
      opponentHpDelta: -1,
      selfGetsItem: false,
      description: "攻撃マス：相手にダメージ",
    }))
    .with({ tileEffect: "curse", self: { pokerfaceActive: true } }, () => ({
      selfHpDelta: 0,
      opponentHpDelta: 0,
      selfGetsItem: false,
      description: "呪いマス：ポーカーフェイスで無効化",
    }))
    .with(
      { tileEffect: "curse", self: { character: { id: "swindler" } } },
      () => ({
        selfHpDelta: 0,
        opponentHpDelta: 0,
        selfGetsItem: false,
        description: "呪いマス：ペテン師の能力で無効化",
      }),
    )
    .with({ tileEffect: "curse" }, () => ({
      selfHpDelta: -1,
      opponentHpDelta: 0,
      selfGetsItem: false,
      description: "呪いマス：ダメージ",
    }))
    .with({ tileEffect: "blessing" }, () => ({
      selfHpDelta: 1,
      opponentHpDelta: 0,
      selfGetsItem: false,
      description: "加護マス：HP回復",
    }))
    .with({ tileEffect: "treasure" }, () => ({
      selfHpDelta: 0,
      opponentHpDelta: 0,
      selfGetsItem: true,
      description: "宝物マス：アイテム獲得",
    }))
    .with({ tileEffect: "empty" }, () => ({
      selfHpDelta: 0,
      opponentHpDelta: 0,
      selfGetsItem: false,
      description: "空きマス：何も起こらない",
    }))
    .exhaustive();
}

export function clampHp(hp: number, maxHp: number): number {
  return Math.max(0, Math.min(maxHp, hp));
}

export function checkWinner(
  player: PlayerState,
  cpu: PlayerState,
): TurnSide | "draw" | "ongoing" {
  return match({ player, cpu })
    .returnType<TurnSide | "draw" | "ongoing">()
    .with(
      { player: { hp: P.number.lte(0) }, cpu: { hp: P.number.lte(0) } },
      () => "draw",
    )
    .with({ player: { hp: P.number.lte(0) } }, () => "cpu")
    .with({ cpu: { hp: P.number.lte(0) } }, () => "player")
    .otherwise(() => "ongoing");
}
