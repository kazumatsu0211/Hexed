import type { IconWeight } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { match } from "ts-pattern";

import type { PeekedTile, Tile as TileData } from "../../core/types";
import { Icon } from "./_parts/Icon";
import { getVisualState } from "./_utils/getVisualState";
import { effectStyles, tileButtonVariants } from "./TileButton.styles";

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

  const isHidden = state === "hidden";
  const isShowingEffect = !isHidden;
  const isLabelVisible = isShowingEffect && tile.effect !== "empty";
  const isPeekedOverlayVisible = state === "peeked";

  const effectStyle = effectStyles[tile.effect];

  const baseClassName = tileButtonVariants({
    state,
    disabled: isDisabled,
  });
  const className = isShowingEffect
    ? `${baseClassName} ${effectStyle.revealed}`
    : baseClassName;

  const whileHoverScale = isDisabled ? 1 : 1.05;
  const whileTapScale = isDisabled ? 1 : 0.95;

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
    .with("peeked", () => "regular")
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
      <div className="flex flex-col items-center gap-0.5">
        <Icon weight={weight} tileEffect={tile.effect} isHidden={isHidden} />
        {isLabelVisible && (
          <span className="font-title text-xs opacity-90">
            {effectStyle.label}
          </span>
        )}
      </div>
      {isPeekedOverlayVisible && (
        <motion.div
          className="absolute inset-0 bg-accent-gold/[0.08] pointer-events-none"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
