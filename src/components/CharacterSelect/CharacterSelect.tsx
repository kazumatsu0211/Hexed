import { motion } from "framer-motion";
import { useState } from "react";

import { CHARACTERS } from "../../core/characters";
import type { CharacterId } from "../../core/types";
import { Ornament } from "../Ornament/Ornament";
import { Watermark } from "../Watermark/Watermark";

const ALL_CHAR_IDS: CharacterId[] = ["gambler", "swindler", "connoisseur"];

function pickRandomCpu(playerCharId: CharacterId): CharacterId {
  const others = ALL_CHAR_IDS.filter((id) => id !== playerCharId);
  return others[Math.floor(Math.random() * others.length)];
}

type CharacterSelectProps = {
  onStart: (playerCharId: CharacterId, cpuCharId: CharacterId) => void;
};

export function CharacterSelect(props: CharacterSelectProps) {
  const { onStart } = props;
  const [selectedId, setSelectedId] = useState<CharacterId | null>(null);

  function handleStart() {
    if (!selectedId) return;
    onStart(selectedId, pickRandomCpu(selectedId));
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-6 relative overflow-hidden bg-casino-radial">
      <div className="absolute inset-0 pointer-events-none bg-vignette" />
      <Watermark />

      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl">
        <div className="flex flex-col items-center mb-10 w-72">
          <Ornament />
          <h1 className="my-2 text-center tracking-[0.3em] uppercase font-title font-black text-accent-gold text-[5.5rem] leading-[1.05] text-shadow-gold-glow">
            HEXED
          </h1>
          <Ornament />
          <p className="mt-5 italic tracking-[0.14em] text-center font-serif text-accent-gold-dim">
            キャラクターを選択してください
          </p>
        </div>

        <div className="flex gap-6 mb-10 flex-wrap justify-center">
          {ALL_CHAR_IDS.map((id) => {
            const character = CHARACTERS[id];
            const isSelected = selectedId === id;

            return (
              <motion.button
                key={id}
                type="button"
                onClick={() => setSelectedId(id)}
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className={`relative cursor-pointer text-left overflow-hidden w-[280px] rounded-[2px] border-2 transition-colors ${
                  isSelected
                    ? "bg-[#261d12] border-accent-gold shadow-gold-glow"
                    : "bg-[#1a130c] border-[#3e2e1a] shadow-panel-deep"
                }`}
              >
                <div
                  className={`relative overflow-hidden aspect-square border-b ${
                    isSelected ? "border-accent-gold" : "border-[#3e2e1a]"
                  }`}
                >
                  <img
                    src={`/characters/${id}.png`}
                    alt={character.name}
                    className={`w-full h-full object-cover transition-[filter] ${
                      isSelected ? "brightness-105" : "brightness-90"
                    }`}
                  />
                  <div
                    className={`absolute inset-x-0 bottom-0 h-1/3 pointer-events-none bg-gradient-to-t to-transparent ${
                      isSelected ? "from-[#261d12]" : "from-[#1a130c]"
                    }`}
                  />
                </div>

                <div className="px-5 py-5 text-center">
                  <p
                    className={`font-serif font-semibold text-accent-gold text-[1.65rem] mb-1 ${
                      isSelected ? "text-shadow-gold-soft" : ""
                    }`}
                  >
                    {character.name}
                  </p>
                  <p className="italic font-serif text-accent-gold-dim text-sm">
                    {character.description}
                  </p>
                </div>

                {isSelected && (
                  <>
                    <div className="absolute top-1.5 left-1.5 w-4 h-4 pointer-events-none border-t border-l border-accent-gold" />
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 pointer-events-none border-t border-r border-accent-gold" />
                    <div className="absolute bottom-1.5 left-1.5 w-4 h-4 pointer-events-none border-b border-l border-accent-gold" />
                    <div className="absolute bottom-1.5 right-1.5 w-4 h-4 pointer-events-none border-b border-r border-accent-gold" />
                  </>
                )}
              </motion.button>
            );
          })}
        </div>

        <motion.button
          type="button"
          disabled={!selectedId}
          onClick={handleStart}
          whileTap={selectedId ? { scale: 0.97 } : undefined}
          className="font-title text-[0.9rem] tracking-[0.22em] px-14 py-3.5 border rounded-[1px] transition-all enabled:text-accent-gold enabled:border-accent-gold enabled:hover:bg-accent-gold/10 enabled:hover:shadow-gold-glow-sm enabled:cursor-pointer disabled:text-[#4a3820] disabled:border-[#3a2814] disabled:cursor-not-allowed"
        >
          ゲーム開始
        </motion.button>
      </div>
    </div>
  );
}
