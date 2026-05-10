import { match } from "ts-pattern";

import type { TurnSide } from "../../core/types";

type GameOverModalProps = {
  winner: TurnSide | "draw";
  onRestart: () => void;
};

export function GameOverModal({ winner, onRestart }: GameOverModalProps) {
  const message = match(winner)
    .with("player", () => "🎉 勝利")
    .with("cpu", () => "☠️ 敗北")
    .with("draw", () => "引き分け")
    .exhaustive();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-bg-mid border-2 border-accent-gold p-8 rounded-lg text-center">
        <h2 className="text-4xl font-title text-accent-gold mb-4">{message}</h2>
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-accent-gold text-bg-dark rounded font-bold hover:bg-accent-gold/80 transition-colors"
        >
          もう一度
        </button>
      </div>
    </div>
  );
}
