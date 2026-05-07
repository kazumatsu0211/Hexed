import type { ReactNode } from "react";

type BoardGridProps = {
  tileButtons: ReactNode[];
};

export function BoardGrid(props: BoardGridProps) {
  const { tileButtons } = props;

  return (
    <div className="grid grid-cols-5 gap-2 p-4 bg-bg-light/30 rounded-lg max-w-md mx-auto">
      {tileButtons}
    </div>
  );
}
