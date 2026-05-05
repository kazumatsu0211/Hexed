function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-6xl font-title text-accent-gold tracking-wider">
        HEXED
      </h1>
      <p className="text-accent-gold-dim font-body">Phase 0 — Setup OK</p>
      <div className="flex gap-3">
        <span className="px-3 py-1 rounded bg-bg-mid border border-accent-gold-dim text-accent-gold text-sm">
          Vite
        </span>
        <span className="px-3 py-1 rounded bg-bg-mid border border-accent-gold-dim text-accent-gold text-sm">
          React
        </span>
        <span className="px-3 py-1 rounded bg-bg-mid border border-accent-gold-dim text-accent-gold text-sm">
          TypeScript
        </span>
        <span className="px-3 py-1 rounded bg-bg-mid border border-accent-gold-dim text-accent-gold text-sm">
          Tailwind
        </span>
      </div>
    </div>
  );
}

export default App;
