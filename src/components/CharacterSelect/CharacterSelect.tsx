import { useState } from "react";

import { CHARACTERS } from "../../core/characters";
import type { CharacterId } from "../../core/types";

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
    <div className="flex flex-col items-center gap-6">
      <p className="text-accent-gold-dim text-lg">キャラクターを選択してください</p>

      <div className="flex gap-4">
        {ALL_CHAR_IDS.map((id) => {
          const character = CHARACTERS[id];
          const isSelected = selectedId === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedId(id)}
              className={`flex flex-col items-center gap-3 p-4 w-64 rounded-lg border-2 transition-colors ${
                isSelected
                  ? "border-accent-gold bg-accent-gold/10"
                  : "border-accent-gold-dim hover:border-accent-gold/60"
              }`}
            >
              <img
                src={`/characters/${id}.png`}
                alt={character.name}
                className="w-48 h-48 object-cover rounded"
              />
              <h2 className="text-2xl font-title text-accent-gold tracking-wider">
                {character.name}
              </h2>
              <p className="text-sm text-accent-gold-dim text-center">
                {character.description}
              </p>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleStart}
        disabled={!selectedId}
        className="px-8 py-3 bg-accent-gold text-bg-dark rounded font-bold text-lg hover:bg-accent-gold/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ゲーム開始
      </button>
    </div>
  );
}
