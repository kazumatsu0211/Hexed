import { motion } from "framer-motion";

import type { PlayerState, TurnSide } from "../../core/types";
import { HpBar } from "../HpBar/HpBar";
import { Ornament } from "../Ornament/Ornament";

type CharacterPanelProps = {
  side: TurnSide;
  player: PlayerState;
  isActive: boolean;
};

export function CharacterPanel(props: CharacterPanelProps) {
  const { side, player, isActive } = props;
  const { character } = player;

  const isCpu = side === "cpu";
  const isPulsing = isActive && isCpu;
  const labelEn = isCpu ? "OPPONENT" : "YOU";
  const isGagged = player.gaggedTurns > 0;
  const isPokerfaceActive = player.pokerfaceActive;
  const hasStatus = isGagged || isPokerfaceActive;

  const containerActiveClasses = isActive
    ? "border-accent-gold bg-[radial-gradient(ellipse_at_center,_#261d12_0%,_#1a1410_100%)] shadow-gold-glow"
    : "border-[#3e2e1a] bg-[radial-gradient(ellipse_at_center,_#1a130c_0%,_#0e0a07_100%)]";

  const nameActiveClasses = isActive
    ? "text-accent-gold text-shadow-gold-soft"
    : "text-accent-gold-dim";

  const portraitActiveClasses = isActive
    ? "border-accent-gold brightness-105"
    : "border-[#3e2e1a] brightness-75";

  return (
    <motion.div
      animate={isPulsing ? { opacity: [1, 0.65, 1] } : { opacity: 1 }}
      transition={isPulsing ? { repeat: Infinity, duration: 1.2 } : undefined}
      className={`relative flex flex-col items-center gap-3 px-5 py-5 rounded-[2px] border-2 transition-all w-[320px] outline outline-1 [outline-offset:-7px] ${
        isActive ? "outline-accent-gold" : "outline-[#2a2018]"
      } ${containerActiveClasses}`}
    >
      <div className="absolute top-1.5 left-1.5 w-5 h-5 pointer-events-none border-t border-l border-accent-gold opacity-60" />
      <div className="absolute top-1.5 right-1.5 w-5 h-5 pointer-events-none border-t border-r border-accent-gold opacity-60" />
      <div className="absolute bottom-1.5 left-1.5 w-5 h-5 pointer-events-none border-b border-l border-accent-gold opacity-60" />
      <div className="absolute bottom-1.5 right-1.5 w-5 h-5 pointer-events-none border-b border-r border-accent-gold opacity-60" />

      <p
        className={`font-title text-xs tracking-[0.3em] uppercase transition-colors ${
          isActive ? "text-accent-gold" : "text-accent-gold-dim"
        }`}
      >
        {labelEn}
      </p>

      <div
        className={`w-[280px] h-[280px] overflow-hidden rounded-[2px] border-2 transition-all ${portraitActiveClasses}`}
      >
        <img
          src={`/characters/${character.id}.png`}
          alt={character.name}
          className="w-full h-full object-cover"
        />
      </div>

      <Ornament />

      <h3
        className={`font-serif font-bold text-[1.8rem] tracking-wide leading-none transition-colors ${nameActiveClasses}`}
      >
        {character.name}
      </h3>

      <HpBar hp={player.hp} maxHp={player.maxHp} />

      <div className="w-full relative mt-1 px-4 py-3 border border-accent-gold-dim/50 rounded-[2px] bg-bg-dark/40">
        <span className="absolute -top-2 left-3 px-2 bg-bg-dark font-title text-[0.6rem] tracking-[0.2em] uppercase text-accent-gold-dim">
          Ability
        </span>
        <p className="font-serif text-sm text-accent-gold-dim text-center leading-snug">
          {character.description}
        </p>
      </div>

      <div className="w-full relative px-4 py-3 border border-accent-gold-dim/50 rounded-[2px] bg-bg-dark/40 min-h-[60px] flex items-center justify-center">
        <span className="absolute -top-2 left-3 px-2 bg-bg-dark font-title text-[0.6rem] tracking-[0.2em] uppercase text-accent-gold-dim">
          Status
        </span>

        {!hasStatus && (
          <span className="font-jp text-xs text-accent-gold-dim">
            — 通常 —
          </span>
        )}

        {hasStatus && (
          <div className="flex flex-col items-center gap-1">
            {isGagged && (
              <span className="font-jp text-xs text-accent-curse tracking-widest">
                ▸ 猿轡中 ({player.gaggedTurns})
              </span>
            )}
            {isPokerfaceActive && (
              <span className="font-jp text-xs text-accent-gold tracking-widest">
                ▸ ポーカーフェイス発動中
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
