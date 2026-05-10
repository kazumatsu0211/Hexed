import { BoardGrid } from "./components/BoardGrid/BoardGrid";
import { GameOverModal } from "./components/GameOverModal/GameOverModal";
import { HpBar } from "./components/HpBar/HpBar";
import { TileButton } from "./components/TileButton/TileButton";
import { useGameStore } from "./store/gameStore";

export function App() {
  const board = useGameStore((s) => s.board);
  const players = useGameStore((s) => s.players);
  const currentTurn = useGameStore((s) => s.currentTurn);
  const turnCount = useGameStore((s) => s.turnCount);
  const winner = useGameStore((s) => s.winner);

  const openTile = useGameStore((s) => s.openTile);
  const reset = useGameStore((s) => s.reset);

  return (
    <div className="min-h-screen flex flex-col items-center p-8 gap-4">
      <h1 className="text-6xl font-title text-accent-gold tracking-wider">
        HEXED
      </h1>

      <p className="text-accent-gold/60">
        Turn {turnCount + 1} —{" "}
        {currentTurn === "player" ? "🟢 Your turn" : "🔴 CPU turn"}
      </p>

      <HpBar
        hp={players.cpu.hp}
        maxHp={players.cpu.maxHp}
        label={`CPU (${players.cpu.character.name})`}
      />

      <BoardGrid
        tileButtons={board.flat().map((tile) => (
          <TileButton
            key={`${tile.position.row}-${tile.position.col}`}
            tile={tile}
            onClick={() => openTile(tile.position)}
            disabled={currentTurn !== "player" || winner !== "ongoing"}
          />
        ))}
      />

      <HpBar
        hp={players.player.hp}
        maxHp={players.player.maxHp}
        label={`YOU (${players.player.character.name})`}
      />

      {winner !== "ongoing" && (
        <GameOverModal winner={winner} onRestart={reset} />
      )}
    </div>
  );
}
