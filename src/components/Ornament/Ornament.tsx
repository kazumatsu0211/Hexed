export function Ornament() {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-accent-gold" />
      <span className="text-accent-gold text-xs">◆</span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-accent-gold" />
    </div>
  );
}
