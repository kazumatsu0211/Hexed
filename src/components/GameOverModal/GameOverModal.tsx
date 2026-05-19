import { motion } from "framer-motion";
import { match } from "ts-pattern";

import type { TurnSide } from "../../core/types";

type GameOverModalProps = {
  winner: TurnSide | "draw";
  onRestart: () => void;
};

type ResultConfig = {
  emoji: string;
  title: string;
  titleEn: string;
  subtitle: string;
  colorClass: string;
  borderClass: string;
  gradientFromClass: string;
};

function getConfig(winner: TurnSide | "draw"): ResultConfig {
  return match(winner)
    .returnType<ResultConfig>()
    .with("player", () => ({
      emoji: "🎉",
      title: "勝利",
      titleEn: "VICTORY",
      subtitle: "運命は貴殿に微笑んだ",
      colorClass: "text-accent-gold",
      borderClass: "border-accent-gold",
      gradientFromClass: "from-accent-gold",
    }))
    .with("cpu", () => ({
      emoji: "☠️",
      title: "敗北",
      titleEn: "DEFEAT",
      subtitle: "賭けは常に代価を伴う",
      colorClass: "text-accent-blood",
      borderClass: "border-accent-blood",
      gradientFromClass: "from-accent-blood",
    }))
    .with("draw", () => ({
      emoji: "⚖️",
      title: "引き分け",
      titleEn: "DRAW",
      subtitle: "均衡の夜",
      colorClass: "text-accent-gold-dim",
      borderClass: "border-accent-gold-dim",
      gradientFromClass: "from-accent-gold-dim",
    }))
    .exhaustive();
}

export function GameOverModal(props: GameOverModalProps) {
  const { winner, onRestart } = props;
  const config = getConfig(winner);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`relative w-[420px] flex flex-col items-center text-center px-14 py-12 bg-[radial-gradient(ellipse_at_center,_#2d2114,_#1a1410)] border-2 ${config.borderClass} rounded-[2px] shadow-[0_0_60px_rgba(201,169,97,0.2),_0_20px_60px_rgba(0,0,0,0.8)]`}
      >
        <div className={`absolute top-2 left-2 w-6 h-6 pointer-events-none border-t border-l ${config.borderClass}`} />
        <div className={`absolute top-2 right-2 w-6 h-6 pointer-events-none border-t border-r ${config.borderClass}`} />
        <div className={`absolute bottom-2 left-2 w-6 h-6 pointer-events-none border-b border-l ${config.borderClass}`} />
        <div className={`absolute bottom-2 right-2 w-6 h-6 pointer-events-none border-b border-r ${config.borderClass}`} />

        <div className="text-4xl mb-3">{config.emoji}</div>

        <div className="flex items-center gap-3 mb-2 w-full justify-center">
          <div className={`h-px flex-1 bg-gradient-to-l ${config.gradientFromClass} to-transparent`} />
          <p className={`font-title font-bold text-[2.2rem] tracking-[0.2em] ${config.colorClass} text-shadow-gold-soft`}>
            {config.titleEn}
          </p>
          <div className={`h-px flex-1 bg-gradient-to-r ${config.gradientFromClass} to-transparent`} />
        </div>

        <p className={`font-serif text-[1.6rem] mb-2 ${config.colorClass}`}>
          {config.title}
        </p>

        <p className="font-serif italic text-base text-accent-gold-dim mb-8">
          {config.subtitle}
        </p>

        <button
          type="button"
          onClick={onRestart}
          className="font-title text-[0.85rem] tracking-[0.2em] px-11 py-3 bg-transparent text-accent-gold border border-accent-gold rounded-[1px] hover:bg-accent-gold/10 hover:shadow-gold-glow-sm transition-all"
        >
          もう一度
        </button>
      </motion.div>
    </motion.div>
  );
}
