import type { IconWeight } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { match } from "ts-pattern";

import type { PeekedTile, Tile as TileData } from "../../core/types";
import { Icon } from "./_parts/Icon";
import { getVisualState } from "./_utils/getVisualState";
import { tileButtonVariants } from "./TileButton.styles";

type TileButtonProps = {
  tile: TileData;
  onClick: () => void;
  peeked?: PeekedTile;
  disabled?: boolean;
};

export function TileButton(props: TileButtonProps) {
  const { tile, onClick, peeked, disabled } = props;

  const state = getVisualState(tile, peeked);

  const isDisabled = disabled || tile.isRevealed;

  const whileHoverScale = isDisabled ? 1 : 1.05;
  const whileTapScale = isDisabled ? 1 : 0.95;

  const isHidden = state === "hidden";
  const className = tileButtonVariants({ state, disabled: isDisabled });

  const row = tile.position.row + 1;
  const col = tile.position.col + 1;

  const ariaLabel = match(state)
    .with("hidden", () => `${row}行${col}列、未開のマス`)
    .with("peeked", () => `${row}行${col}列、${tile.effect}（覗き済み）`)
    .with("revealed", () => `${row}行${col}列、${tile.effect}（開封済み）`)
    .exhaustive();

  const weight = match(state)
    .returnType<IconWeight>()
    .with("revealed", () => "fill")
    .with("peeked", () => "light")
    .with("hidden", () => "regular")
    .exhaustive();

  return (
    <motion.button
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      className={className}
      whileHover={{ scale: whileHoverScale }}
      whileTap={{ scale: whileTapScale }}
    >
      <Icon weight={weight} tileEffect={tile.effect} isHidden={isHidden} />
    </motion.button>
  );
}
