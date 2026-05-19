import type { ReactNode } from "react";

import { OrnateFrame } from "../OrnateFrame/OrnateFrame";

type BoardGridProps = {
  tileButtons: ReactNode[];
};

export function BoardGrid(props: BoardGridProps) {
  const { tileButtons } = props;

  return (
    <OrnateFrame>
      <div className="p-3 bg-[#110e0a] border-2 border-accent-gold-dim outline outline-1 outline-[#3a2e22] [outline-offset:-5px] rounded-[2px]">
        <div className="grid grid-cols-5 gap-1.5">{tileButtons}</div>
      </div>
    </OrnateFrame>
  );
}
